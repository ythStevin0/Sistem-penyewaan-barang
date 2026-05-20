import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductDetailClient } from "@/components/catalog/product-detail-client";
import type { Product } from "@/types";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0; // Memaksa SSR agar stok selalu terupdate secara real-time

// Membuat metadata dinamis berdasarkan produk yang sedang dibuka
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const supabase = createSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("nama, deskripsi")
    .eq("slug", params.slug)
    .single();

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan - Samidd Outdoor",
    };
  }

  return {
    title: `${product.nama} - Samidd Outdoor`,
    description: product.deskripsi,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const supabase = createSupabaseServerClient();

  // Mengambil data produk beserta kategori terkait
  const { data: productData, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        nama,
        slug
      )
    `)
    .eq("slug", params.slug)
    .single();

  // Jika error atau produk tidak ada, arahkan ke halaman 404 Next.js
  if (error || !productData) {
    notFound();
  }

  // Casting data ke tipe Product
  const product = productData as unknown as Product;

  return (
    <div className="bg-background min-h-screen py-4">
      <ProductDetailClient product={product} />
    </div>
  );
}
