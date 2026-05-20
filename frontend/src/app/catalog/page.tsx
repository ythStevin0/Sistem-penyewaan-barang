import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CatalogClient } from "@/components/catalog/catalog-client";
import type { Product, Category } from "@/types";

export const revalidate = 0; // Memaksa halaman untuk selalu melakukan fetch data terbaru (SSR)

export const metadata = {
  title: "Katalog Alat Outdoor - Samidd Outdoor",
  description: "Sewa berbagai macam perlengkapan pendakian gunung berkualitas dengan harga terjangkau di Malang.",
};

export default async function CatalogPage() {
  const supabase = createSupabaseServerClient();

  // 1. Fetch data kategori dari database Supabase
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("nama", { ascending: true });

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError.message);
  }

  // 2. Fetch data produk beserta relasi kategorinya
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        nama,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Error fetching products:", productsError.message);
  }

  // Casting data ke tipe TypeScript yang sesuai
  const categories = (categoriesData as Category[]) || [];
  const products = (productsData as unknown as Product[]) || [];

  return (
    <div className="bg-background min-h-screen">
      <CatalogClient initialProducts={products} categories={categories} />
    </div>
  );
}
