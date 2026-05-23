import { requireAdmin } from "@/lib/supabase/admin-auth";
import { CategoriesManager } from "@/components/admin/categories-manager";
import type { Category } from "@/types";

export const metadata = { title: "Kategori | Admin" };

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("nama");

  return <CategoriesManager categories={(data as Category[]) ?? []} />;
}
