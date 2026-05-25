"use client";

import Link from "next/link";
import { CheckCircle2, LayoutDashboard } from "lucide-react";
import { RentalQr } from "@/components/rental/rental-qr";

export function BookingSuccessClient({ rentalId }: { rentalId: string }) {
  return (
    <div className="container py-20 max-w-lg text-center">
      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-extrabold text-forest-950 dark:text-forest-50 mb-2">
        Pemesanan Berhasil!
      </h1>
      <p className="text-muted-foreground mb-6">
        Status: <strong>menunggu pembayaran</strong>
      </p>

      <div className="flex justify-center mb-6">
        <RentalQr rentalId={rentalId} />
      </div>
      <p className="text-xs text-muted-foreground font-mono mb-8">ID: {rentalId}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-xl font-bold hover:bg-muted"
        >
          Lanjut Belanja
        </Link>
      </div>
    </div>
  );
}
