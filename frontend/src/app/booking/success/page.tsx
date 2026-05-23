import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, LayoutDashboard } from "lucide-react";

export const metadata: Metadata = {
  title: "Pemesanan Berhasil | Samidd Outdoor",
};

interface PageProps {
  searchParams: { id?: string };
}

export default function BookingSuccessPage({ searchParams }: PageProps) {
  const rentalId = searchParams.id;

  return (
    <div className="container py-20 max-w-lg text-center">
      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-extrabold text-forest-950 mb-2">Pemesanan Berhasil!</h1>
      <p className="text-muted-foreground mb-2">
        Pesanan Anda telah dicatat dengan status <strong>menunggu pembayaran</strong>.
      </p>
      {rentalId && (
        <p className="text-xs text-muted-foreground mb-8 font-mono">ID: {rentalId.slice(0, 8)}…</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90"
        >
          <LayoutDashboard className="h-5 w-5" />
          Lihat Dashboard
        </Link>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-xl font-bold hover:bg-forest-50"
        >
          Lanjut Belanja
        </Link>
      </div>
    </div>
  );
}
