"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  AlertCircle,
  CreditCard,
  Banknote,
  Upload,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators/booking";
import { createBooking } from "@/app/actions/booking";
import { uploadUserFile } from "@/lib/storage/upload";
import { formatRupiah } from "@/lib/format/currency";
import { paymentMethodLabels } from "@/lib/rental/labels";

interface CheckoutClientProps {
  userId: string;
}

export function CheckoutClient({ userId }: CheckoutClientProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const {
    cartItems,
    startDate,
    endDate,
    totalDays,
    subtotal,
    depositAmount,
    grandTotal,
    clearCart,
  } = useCart();

  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { metode_pembayaran: "transfer_bank", catatan: "" },
  });

  const metode = watch("metode_pembayaran");

  if (cartItems.length === 0 || !startDate || !endDate || totalDays <= 0) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-bold text-foreground mb-2">Checkout tidak tersedia</h1>
        <p className="text-muted-foreground mb-6">
          Keranjang kosong atau tanggal sewa belum dipilih.
        </p>
        <Link href="/cart" className="text-primary font-semibold hover:underline">
          Kembali ke keranjang
        </Link>
      </div>
    );
  }

  const onSubmit = async (formData: CheckoutInput) => {
    if (!ktpFile) {
      setSubmitError("Upload foto KTP wajib untuk setiap pemesanan.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploadResult = await uploadUserFile(supabase, "ktp", userId, ktpFile);
      if ("error" in uploadResult) {
        setSubmitError(uploadResult.error);
        return;
      }

      const result = await createBooking({
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        tanggal_mulai: startDate,
        tanggal_selesai: endDate,
        jaminan_ktp_url: uploadResult.path,
        metode_pembayaran: formData.metode_pembayaran,
        catatan: formData.catatan?.trim() || undefined,
      });

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      clearCart();
      router.push(`/booking/success?id=${result.rentalId}`);
      router.refresh();
    } catch {
      setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke keranjang
      </Link>

      <h1 className="text-3xl font-extrabold text-foreground mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">
        Periode {startDate} s/d {endDate} · {totalDays} hari
      </p>

      {submitError && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Ringkasan barang */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h2 className="font-bold text-foreground">Barang Disewa</h2>
            {cartItems.map((item) => {
              const img =
                item.product.gambar_urls?.[0] ||
                "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=100&auto=format&fit=crop";
              return (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0">
                    <Image src={img} alt={item.product.nama} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-1">{item.product.nama}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} unit × {formatRupiah(item.product.harga_sewa_per_hari)}/hari
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upload KTP */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-foreground flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Jaminan KTP
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Upload KTP wajib untuk setiap pemesanan (JPG, PNG, WebP, atau PDF, maks. 5 MB).
            </p>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium text-foreground">
                {ktpFile ? ktpFile.name : "Pilih file KTP"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => setKtpFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {/* Metode bayar */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-4">Metode Pembayaran</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  value="transfer_bank"
                  className="mt-1"
                  {...register("metode_pembayaran")}
                />
                <div>
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    {paymentMethodLabels.transfer_bank}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Transfer ke rekening Samidd Outdoor, lalu upload bukti di dashboard.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-border cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  value="tunai"
                  className="mt-1"
                  {...register("metode_pembayaran")}
                />
                <div>
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-accent" />
                    {paymentMethodLabels.tunai}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Booking online dulu. Bayar tunai saat mengambil barang di lokasi.
                  </p>
                </div>
              </label>
            </div>
            {errors.metode_pembayaran && (
              <p className="text-destructive text-xs mt-2">{errors.metode_pembayaran.message}</p>
            )}
          </div>

          {/* Catatan */}
          <div className="bg-card rounded-xl border border-border p-5">
            <label className="font-bold text-foreground block mb-2" htmlFor="catatan">
              Catatan (opsional)
            </label>
            <textarea
              id="catatan"
              rows={3}
              placeholder="Contoh: ambil barang jam 08.00"
              className="w-full rounded-lg border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("catatan")}
            />
          </div>
        </div>

        {/* Sidebar ringkasan */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-card rounded-xl border border-border p-5 shadow-sm">
            <h2 className="font-bold text-foreground mb-4">Total Pembayaran</h2>
            <dl className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal sewa</dt>
                <dd className="font-semibold">{formatRupiah(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Deposit (20%)</dt>
                <dd className="font-semibold">{formatRupiah(depositAmount)}</dd>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <dt className="font-bold">Total</dt>
                <dd className="text-lg font-black text-primary">{formatRupiah(grandTotal)}</dd>
              </div>
            </dl>

            {metode === "tunai" && (
              <p className="text-xs alert-warning rounded-lg px-3 py-2 mb-4">
                Status awal: menunggu pembayaran. Bayar tunai saat pengambilan barang.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-bold hover:bg-accent/90 disabled:opacity-55 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Konfirmasi Pemesanan"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
