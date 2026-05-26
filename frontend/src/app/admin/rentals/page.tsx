import { requireAdmin } from "@/lib/supabase/admin-auth";
import { processOverdueRentals } from "@/app/actions/overdue";
import { OverdueBanner } from "@/components/notifications/overdue-banner";
import { RentalsManager } from "@/components/admin/rentals-manager";

export const metadata = { title: "Penyewaan | Admin" };

export default async function AdminRentalsPage() {
  const { supabase } = await requireAdmin();
  const { count: overdueProcessed } = await processOverdueRentals();

  const { data } = await supabase
    .from("rentals")
    .select(
      `
      *,
      users ( nama_lengkap, no_hp ),
      rental_items ( *, products ( nama, slug ) ),
      payments (*)
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Kelola Penyewaan</h1>
      <OverdueBanner count={overdueProcessed} role="admin" />
      <RentalsManager rentals={data ?? []} />
    </div>
  );
}
