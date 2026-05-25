import { requireAdmin } from "@/lib/supabase/admin-auth";
import { processOverdueRentals } from "@/app/actions/overdue";
import { OverdueBanner } from "@/components/notifications/overdue-banner";
import { formatRupiah } from "@/lib/format/currency";
import { Package, Clock, Banknote, TrendingUp } from "lucide-react";

export const metadata = { title: "Admin | Samidd Outdoor" };

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const { count: overdueProcessed } = await processOverdueRentals();

  const [
    { count: totalRentals },
    { count: pendingRentals },
    { data: payments },
    { data: topItems },
  ] = await Promise.all([
    supabase.from("rentals").select("*", { count: "exact", head: true }),
    supabase
      .from("rentals")
      .select("*", { count: "exact", head: true })
      .eq("status", "menunggu_pembayaran"),
    supabase.from("payments").select("jumlah, status").eq("status", "sukses"),
    supabase.from("rental_items").select("product_id, jumlah, products(nama)").limit(100),
  ]);

  const revenue = (payments ?? []).reduce((s, p) => s + p.jumlah, 0);

  const productCounts: Record<string, { nama: string; total: number }> = {};
  for (const item of topItems ?? []) {
    const pid = item.product_id;
    const nama =
      item.products && typeof item.products === "object" && "nama" in item.products
        ? String((item.products as { nama: string }).nama)
        : "Produk";
    if (!productCounts[pid]) productCounts[pid] = { nama, total: 0 };
    productCounts[pid].total += item.jumlah;
  }
  const popular = Object.values(productCounts)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const stats = [
    { label: "Total Pesanan", value: String(totalRentals ?? 0), icon: Package },
    { label: "Menunggu Bayar", value: String(pendingRentals ?? 0), icon: Clock },
    { label: "Pendapatan (verified)", value: formatRupiah(revenue), icon: Banknote },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-forest-950 mb-6">Ringkasan</h1>
      <OverdueBanner count={overdueProcessed} role="admin" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-5">
            <Icon className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground font-semibold uppercase">{label}</p>
            <p className="text-2xl font-black text-forest-950 mt-1">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-bold text-forest-950 flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          Barang Terpopuler
        </h2>
        {popular.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data.</p>
        ) : (
          <ul className="space-y-2">
            {popular.map((p, i) => (
              <li key={p.nama} className="flex justify-between text-sm">
                <span>
                  {i + 1}. {p.nama}
                </span>
                <span className="font-semibold">{p.total} unit disewa</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
