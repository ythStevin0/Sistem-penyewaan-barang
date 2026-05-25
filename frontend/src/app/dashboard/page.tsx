import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { processOverdueRentals } from "@/app/actions/overdue";
import type { Rental } from "@/types/rental";

export const metadata: Metadata = {
  title: "Dashboard Saya | Samidd Outdoor",
  description: "Riwayat penyewaan dan status pembayaran Anda.",
};

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { count: overdueProcessed } = await processOverdueRentals();

  const { data, error } = await supabase
    .from("rentals")
    .select(
      `
      *,
      rental_items (
        *,
        products ( nama, slug, gambar_urls )
      ),
      payments (*)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Dashboard fetch error:", error.message);
  }

  const rentals = (data as Rental[]) ?? [];
  const overdueCount = rentals.filter((r) => r.status === "terlambat").length;

  return (
    <DashboardClient
      rentals={rentals}
      userId={user.id}
      overdueCount={overdueCount}
      overdueProcessed={overdueProcessed}
    />
  );
}
