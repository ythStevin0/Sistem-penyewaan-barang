"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, Check } from "lucide-react";
import type { Rental, RentalStatus } from "@/types/rental";
import { formatRupiah } from "@/lib/format/currency";
import {
  rentalStatusLabels,
  rentalStatusColors,
  paymentMethodLabels,
} from "@/lib/rental/labels";
import {
  verifyPayment,
  confirmCashPayment,
  updateRentalStatus,
  getSignedStorageUrl,
} from "@/app/actions/admin";

interface RentalsManagerProps {
  rentals: (Rental & {
    users?: { nama_lengkap: string; no_hp: string | null } | null;
  })[];
}

const STATUS_OPTIONS: RentalStatus[] = [
  "menunggu_pembayaran",
  "dibayar",
  "diambil",
  "selesai",
  "terlambat",
  "dibatalkan",
];

export function RentalsManager({ rentals: initial }: RentalsManagerProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lateDays, setLateDays] = useState<Record<string, number>>({});

  const run = async (id: string, fn: () => Promise<{ success: boolean; error?: string }>) => {
    setLoadingId(id);
    setError(null);
    const res = await fn();
    if (!res.success) setError(res.error ?? "Gagal.");
    else router.refresh();
    setLoadingId(null);
  };

  const viewFile = async (bucket: "ktp" | "bukti-bayar", path: string) => {
    const res = await getSignedStorageUrl(bucket, path);
    if ("error" in res) setError(res.error);
    else window.open(res.url, "_blank");
  };

  if (initial.length === 0) {
    return <p className="text-muted-foreground">Belum ada pesanan.</p>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {initial.map((rental) => {
        const payment = rental.payments?.[0];
        const isLoading = loadingId === rental.id;

        return (
          <div key={rental.id} className="bg-white rounded-xl border border-border p-5">
            <div className="flex flex-wrap justify-between gap-2 mb-3">
              <div>
                <p className="font-bold text-forest-950">{rental.users?.nama_lengkap ?? "—"}</p>
                <p className="text-xs text-muted-foreground">
                  {rental.users?.no_hp ?? "—"} · #{rental.id.slice(0, 8)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {rental.tanggal_mulai} → {rental.tanggal_selesai}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border h-fit ${rentalStatusColors[rental.status]}`}
              >
                {rentalStatusLabels[rental.status]}
              </span>
            </div>

            <ul className="text-sm text-muted-foreground mb-3 space-y-1">
              {rental.rental_items?.map((item) => (
                <li key={item.id}>
                  {item.products?.nama} × {item.jumlah}
                </li>
              ))}
            </ul>

            <p className="font-black text-primary mb-3">{formatRupiah(rental.total_harga)}</p>

            {payment && (
              <p className="text-xs mb-3">
                Bayar: {paymentMethodLabels[payment.metode_pembayaran]} · {payment.status}
                {rental.denda > 0 && ` · Denda: ${formatRupiah(rental.denda)}`}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {rental.jaminan_ktp_url && (
                <button
                  type="button"
                  onClick={() => void viewFile("ktp", rental.jaminan_ktp_url!)}
                  className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-forest-50"
                >
                  <Eye className="h-3.5 w-3.5" /> KTP
                </button>
              )}
              {payment?.bukti_pembayaran_url && (
                <button
                  type="button"
                  onClick={() => void viewFile("bukti-bayar", payment.bukti_pembayaran_url!)}
                  className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-forest-50"
                >
                  <Eye className="h-3.5 w-3.5" /> Bukti
                </button>
              )}
              {payment?.status === "pending" && payment.bukti_pembayaran_url && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    void run(rental.id, () => verifyPayment(payment.id, rental.id))
                  }
                  className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Verifikasi Bayar
                </button>
              )}
              {payment?.metode_pembayaran === "tunai" &&
                rental.status === "menunggu_pembayaran" && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      void run(rental.id, () => confirmCashPayment(payment.id, rental.id))
                    }
                    className="text-xs px-3 py-1.5 rounded-lg bg-accent text-accent-foreground font-semibold disabled:opacity-50"
                  >
                    Konfirmasi Tunai
                  </button>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <select
                defaultValue={rental.status}
                onChange={(e) => {
                  const status = e.target.value as RentalStatus;
                  if (status === "terlambat") return;
                  void run(rental.id, () => updateRentalStatus(rental.id, status));
                }}
                disabled={isLoading}
                className="text-xs border border-border rounded-lg px-2 py-1.5"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {rentalStatusLabels[s]}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  placeholder="Hari telat"
                  className="text-xs border border-border rounded-lg px-2 py-1.5 w-20"
                  value={lateDays[rental.id] ?? ""}
                  onChange={(e) =>
                    setLateDays((p) => ({ ...p, [rental.id]: Number(e.target.value) }))
                  }
                />
                <button
                  type="button"
                  disabled={isLoading || !lateDays[rental.id]}
                  onClick={() =>
                    void run(rental.id, () =>
                      updateRentalStatus(rental.id, "terlambat", lateDays[rental.id])
                    )
                  }
                  className="text-xs px-2 py-1.5 rounded-lg border border-destructive/30 text-destructive font-semibold disabled:opacity-50"
                >
                  + Denda
                </button>
              </div>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
