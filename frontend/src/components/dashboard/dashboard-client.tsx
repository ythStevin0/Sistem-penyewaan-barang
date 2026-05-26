"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { Rental } from "@/types/rental";
import { formatRupiah } from "@/lib/format/currency";
import {
  rentalStatusLabels,
  rentalStatusColors,
  paymentMethodLabels,
} from "@/lib/rental/labels";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadUserFile } from "@/lib/storage/upload";
import { attachPaymentProof } from "@/app/actions/booking";
import { OverdueBanner } from "@/components/notifications/overdue-banner";
import { RentalQr } from "@/components/rental/rental-qr";

interface DashboardClientProps {
  rentals: Rental[];
  userId: string;
  overdueCount: number;
  overdueProcessed: number;
}

function formatDateId(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function DashboardClient({
  rentals: initialRentals,
  userId,
  overdueCount,
  overdueProcessed,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [rentals, setRentals] = useState(initialRentals);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleUploadProof = async (paymentId: string, file: File) => {
    setUploadingId(paymentId);
    setUploadError(null);
    setUploadSuccess(null);

    const uploadResult = await uploadUserFile(supabase, "bukti-bayar", userId, file);
    if ("error" in uploadResult) {
      setUploadError(uploadResult.error);
      setUploadingId(null);
      return;
    }

    const result = await attachPaymentProof(paymentId, uploadResult.path);
    if (!result.success) {
      setUploadError(result.error);
      setUploadingId(null);
      return;
    }

    setRentals((prev) =>
      prev.map((r) => ({
        ...r,
        payments: r.payments?.map((p) =>
          p.id === paymentId ? { ...p, bukti_pembayaran_url: uploadResult.path } : p
        ),
      }))
    );
    setUploadSuccess("Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.");
    setUploadingId(null);
    router.refresh();
  };

  if (rentals.length === 0) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <Package className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-foreground mb-2">Belum Ada Pesanan</h1>
        <p className="text-muted-foreground mb-6">Riwayat penyewaan Anda akan muncul di sini.</p>
        <Link
          href="/catalog"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold"
        >
          Mulai Sewa
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-foreground mb-1">Dashboard Saya</h1>
      <p className="text-muted-foreground mb-8">Riwayat dan status penyewaan Anda</p>

      <OverdueBanner count={overdueProcessed > 0 ? overdueProcessed : overdueCount} />

      {uploadError && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {uploadError}
        </div>
      )}
      {uploadSuccess && (
        <div className="mb-4 p-3 rounded-lg alert-success text-sm flex gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {uploadSuccess}
        </div>
      )}

      <div className="space-y-6">
        {rentals.map((rental) => {
          const payment = rental.payments?.[0];
          const needsProof =
            payment?.metode_pembayaran === "transfer_bank" &&
            payment.status === "pending" &&
            !payment.bukti_pembayaran_url;

          return (
            <article
              key={rental.id}
              className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-border/60 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">
                    #{rental.id.slice(0, 8).toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDateId(rental.tanggal_mulai)} — {formatDateId(rental.tanggal_selesai)}
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${rentalStatusColors[rental.status]}`}
                >
                  {rentalStatusLabels[rental.status]}
                </span>
              </div>

              <div className="p-5 space-y-3">
                {rental.rental_items?.map((item) => {
                  const img =
                    item.products?.gambar_urls?.[0] ||
                    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=80&auto=format&fit=crop";
                  return (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={img}
                          alt={item.products?.nama ?? "Produk"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.products?.nama ?? "Produk"}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.jumlah} unit · {formatRupiah(item.harga_satuan)}/hari
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-3 border-t border-border/60 flex justify-between items-center">
                  <div className="text-sm">
                    {payment && (
                      <p className="text-muted-foreground">
                        Bayar:{" "}
                        <span className="font-semibold text-foreground">
                          {paymentMethodLabels[payment.metode_pembayaran]}
                        </span>
                      </p>
                    )}
                    {rental.denda > 0 && (
                      <p className="text-destructive text-xs font-semibold mt-1">
                        Denda: {formatRupiah(rental.denda)}
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-black text-primary">{formatRupiah(rental.total_harga)}</p>
                </div>

                {payment?.metode_pembayaran === "tunai" &&
                  rental.status === "menunggu_pembayaran" && (
                    <p className="text-xs alert-warning rounded-lg px-3 py-2">
                      Bayar tunai saat mengambil barang di lokasi Samidd Outdoor.
                    </p>
                  )}

                {needsProof && payment && (
                  <div className="mt-2 p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Upload bukti transfer
                    </p>
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer hover:underline">
                      {uploadingId === payment.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Mengunggah...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Pilih file bukti
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="hidden"
                        disabled={uploadingId === payment.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleUploadProof(payment.id, file);
                        }}
                      />
                    </label>
                  </div>
                )}

                {payment?.bukti_pembayaran_url && payment.status === "pending" && (
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Bukti pembayaran sudah diunggah — menunggu verifikasi admin.
                  </p>
                )}

                <div className="pt-3 flex justify-center">
                  <RentalQr rentalId={rental.id} size={120} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
