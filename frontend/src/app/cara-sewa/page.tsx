import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cara Sewa | Samidd Outdoor",
};

export default function CaraSewaPage() {
  const steps = [
    "Pilih barang di katalog & tambahkan ke keranjang",
    "Atur tanggal sewa & checkout (login wajib)",
    "Upload KTP setiap pemesanan",
    "Bayar transfer (upload bukti) atau tunai saat ambil barang",
    "Kembalikan barang sesuai jadwal",
  ];

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-3xl font-extrabold text-forest-950 dark:text-forest-50 mb-6">Cara Sewa</h1>
      <ol className="space-y-4 mb-8">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-muted-foreground">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <div className="bg-card border border-border rounded-xl p-5 text-sm space-y-2">
        <p>
          <strong>Deposit:</strong> 20% dari subtotal sewa
        </p>
        <p>
          <strong>Denda terlambat:</strong> 15% harga satuan × qty × hari telat
        </p>
      </div>
      <Link href="/catalog" className="inline-block mt-6 text-primary font-bold hover:underline">
        Mulai Sewa →
      </Link>
    </div>
  );
}
