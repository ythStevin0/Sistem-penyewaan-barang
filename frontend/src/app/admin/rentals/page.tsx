import { requireAdmin } from "@/lib/supabase/admin-auth";
import { RentalsManager } from "@/components/admin/rentals-manager";

export const metadata = { title: "Penyewaan | Admin" };

export default async function AdminRentalsPage() {
  const { supabase } = await requireAdmin();

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
      <h1 className="text-2xl font-extrabold text-forest-950 mb-6">Kelola Penyewaan</h1>
      <RentalsManager rentals={data ?? []} />
    </div>
  );
}
