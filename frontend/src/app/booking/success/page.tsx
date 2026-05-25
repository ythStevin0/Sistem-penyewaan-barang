import type { Metadata } from "next";
import { BookingSuccessClient } from "@/components/booking/booking-success-client";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pemesanan Berhasil | Samidd Outdoor",
};

interface PageProps {
  searchParams: { id?: string };
}

export default function BookingSuccessPage({ searchParams }: PageProps) {
  if (searchParams.id) {
    return <BookingSuccessClient rentalId={searchParams.id} />;
  }

  return (
    <div className="container py-20 max-w-lg text-center">
      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-extrabold mb-2">Pemesanan Berhasil!</h1>
      <Link href="/dashboard" className="text-primary font-bold hover:underline">
        Ke Dashboard
      </Link>
    </div>
  );
}
