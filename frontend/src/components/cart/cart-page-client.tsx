"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Calendar,
  ArrowRight,
  Tent,
} from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { formatRupiah } from "@/lib/format/currency";

function todayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function CartPageClient() {
  const {
    cartItems,
    startDate,
    endDate,
    totalDays,
    subtotal,
    depositAmount,
    grandTotal,
    itemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    setRentalDates,
  } = useCart();

  const minDate = todayIsoDate();
  const datesReady = Boolean(startDate && endDate && totalDays > 0);

  const handleStartChange = (value: string) => {
    if (!value) return;
    const end = endDate && endDate >= value ? endDate : value;
    setRentalDates(value, end);
  };

  const handleEndChange = (value: string) => {
    if (!value || !startDate) return;
    if (value < startDate) return;
    setRentalDates(startDate, value);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-16 max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-forest-950 mb-2">Keranjang Kosong</h1>
        <p className="text-muted-foreground mb-8">
          Belum ada peralatan pendakian di keranjang Anda. Jelajahi katalog untuk mulai menyewa.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
        >
          <Tent className="h-5 w-5" />
          Lihat Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-950 flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Keranjang Sewa
          </h1>
          <p className="text-muted-foreground mt-1">
            {itemCount} unit · {cartItems.length} jenis barang
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-semibold text-destructive hover:text-destructive/80 transition-colors self-start sm:self-auto"
        >
          Kosongkan keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daftar barang */}
        <div className="lg:col-span-7 space-y-4">
          {cartItems.map((item) => {
            const imageUrl =
              item.product.gambar_urls?.[0] ||
              "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=200&auto=format&fit=crop";
            const lineTotal =
              datesReady
                ? item.product.harga_sewa_per_hari * item.quantity * totalDays
                : null;

            return (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-border shadow-sm"
              >
                <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={item.product.nama}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/catalog/${item.product.slug}`}
                    className="font-bold text-forest-950 hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.product.nama}
                  </Link>
                  <p className="text-sm text-primary font-semibold mt-0.5">
                    {formatRupiah(item.product.harga_sewa_per_hari)}
                    <span className="text-muted-foreground font-normal">/hari</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-forest-50 disabled:opacity-30 transition-colors"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 font-bold text-sm w-10 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stok}
                        className="p-2 hover:bg-forest-50 disabled:opacity-30 transition-colors"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">Maks. {item.product.stok} unit</span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto flex items-center gap-1 text-xs font-semibold text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>

                  {lineTotal !== null && (
                    <p className="text-sm font-bold text-forest-950 mt-2">
                      Subtotal item: {formatRupiah(lineTotal)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tanggal & ringkasan */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <h2 className="font-bold text-forest-950 flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                Periode Sewa
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Tanggal mulai
                  </span>
                  <input
                    type="date"
                    value={startDate ?? ""}
                    min={minDate}
                    onChange={(e) => handleStartChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Tanggal kembali
                  </span>
                  <input
                    type="date"
                    value={endDate ?? ""}
                    min={startDate ?? minDate}
                    disabled={!startDate}
                    onChange={(e) => handleEndChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                </label>
              </div>
              {datesReady && (
                <p className="text-sm text-muted-foreground mt-3">
                  Durasi sewa: <span className="font-bold text-forest-950">{totalDays} hari</span>
                </p>
              )}
              {!datesReady && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                  Pilih tanggal mulai dan kembali untuk menghitung total harga.
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
              <h2 className="font-bold text-forest-950 mb-4">Ringkasan Biaya</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal sewa</dt>
                  <dd className="font-semibold text-forest-950">
                    {datesReady ? formatRupiah(subtotal) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Deposit jaminan (20%)</dt>
                  <dd className="font-semibold text-forest-950">
                    {datesReady ? formatRupiah(depositAmount) : "—"}
                  </dd>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <dt className="font-bold text-forest-950">Total pembayaran</dt>
                  <dd className="text-lg font-black text-primary">
                    {datesReady ? formatRupiah(grandTotal) : "—"}
                  </dd>
                </div>
              </dl>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Deposit 20% dari subtotal sewa. Upload KTP wajib saat checkout (Tahap berikutnya).
              </p>

              <button
                type="button"
                disabled={!datesReady}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3.5 rounded-xl font-bold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                title="Checkout akan tersedia di Tahap 2"
              >
                Lanjut Checkout
                <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-center text-[11px] text-muted-foreground mt-2">
                Fitur checkout & upload KTP — segera hadir
              </p>

              <Link
                href="/catalog"
                className="mt-3 block w-full text-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                + Tambah barang lain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
