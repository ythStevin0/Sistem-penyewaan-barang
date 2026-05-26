import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/catalog/product-card";
import type { Product } from "@/types";
import { Heart } from "lucide-react";

export const metadata = { title: "Favorit | Samidd Outdoor" };

export default async function WishlistPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/wishlist");

  const { data: wishlistRows } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id);

  const productIds = (wishlistRows ?? []).map((r) => r.product_id);

  if (productIds.length === 0) {
    return (
      <div className="container py-16 text-center max-w-md mx-auto">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold mb-2">Favorit Kosong</h1>
        <p className="text-muted-foreground mb-6">Simpan produk favorit dari katalog.</p>
        <Link href="/catalog" className="text-primary font-bold hover:underline">
          Lihat Katalog
        </Link>
      </div>
    );
  }

  const { data: products } = await supabase
    .from("products")
    .select(`*, categories ( id, nama, slug )`)
    .in("id", productIds);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-extrabold text-foreground mb-6 flex items-center gap-2">
        <Heart className="h-8 w-8 text-accent fill-accent" />
        Favorit Saya
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(products as unknown as Product[])?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
