import Link from "next/link";
import Image from "next/image";
import { Star, ShieldAlert } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Format mata uang Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Gunakan gambar dummy jika array kosong
  const imageUrl = product.gambar_urls?.[0] || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="group relative bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Section */}
      <div className="relative aspect-square w-full bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.nama}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        {product.categories && (
          <span className="absolute top-3 left-3 bg-forest-900/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
            {product.categories.nama}
          </span>
        )}

        {/* Out of Stock Overlay */}
        {product.stok === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-4">
            <ShieldAlert className="h-8 w-8 text-destructive mb-1" />
            <span className="font-bold text-sm">Stok Habis</span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-forest-950 line-clamp-1 group-hover:text-primary transition-colors mb-1">
          <Link href={`/catalog/${product.slug}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {product.nama}
          </Link>
        </h3>
        
        {/* Rating Placeholder (Can be dynamic in future) */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-forest-900">4.8</span>
          <span className="text-[10px] text-muted-foreground">(24 ulasan)</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {product.deskripsi}
        </p>

        {/* Pricing and Stock Footer */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Harga Sewa</span>
            <span className="text-base font-extrabold text-primary">
              {formatRupiah(product.harga_sewa_per_hari)}
              <span className="text-xs font-normal text-muted-foreground">/hari</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Status</span>
            <span className={`text-xs font-semibold ${product.stok > 0 ? "text-green-600" : "text-destructive"}`}>
              {product.stok > 0 ? `${product.stok} Tersedia` : "Habis"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
