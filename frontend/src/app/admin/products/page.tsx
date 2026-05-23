import { requireAdmin } from "@/lib/supabase/admin-auth";
import { ProductsManager } from "@/components/admin/products-manager";
import type { Product, Category } from "@/types";

export const metadata = { title: "Produk | Admin" };

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").order("nama"),
    supabase.from("categories").select("*").order("nama"),
  ]);

  return (
    <ProductsManager
      products={(products as Product[]) ?? []}
      categories={(categories as Category[]) ?? []}
    />
  );
}
