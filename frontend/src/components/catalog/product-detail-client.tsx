"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Minus, Plus, ShoppingBag, ChevronLeft, ShieldCheck, Calendar, Check } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/context/cart-context";
import { formatRupiah } from "@/lib/format/currency";
import { WishlistButton } from "./wishlist-button";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [cartFeedback, setCartFeedback] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleIncrement = () => {
    if (quantity < product.stok) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setCartFeedback(true);
    window.setTimeout(() => setCartFeedback(false), 2500);
  };

  const handleRentNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const imageUrl = product.gambar_urls?.[0] || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="container py-8 max-w-7xl">
      {/* Breadcrumb / Back Button */}
      <div className="mb-6">
        <Link 
          href="/catalog" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Katalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-card border border-border shadow-md">
            <Image
              src={imageUrl}
              alt={product.nama}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Badge & Rating */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              {product.categories && (
                <span className="bg-primary/10 text-primary text-xs uppercase font-extrabold tracking-wider px-3 py-1.5 rounded-full border border-primary/20">
                  {product.categories.nama}
                </span>
              )}
              <WishlistButton productId={product.id} />
            </div>

            <div className="flex items-center gap-1 bg-card px-3 py-1.5 rounded-full border border-border">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-foreground">4.8</span>
              <span className="text-[10px] text-muted-foreground">(24 Ulasan)</span>
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
            {product.nama}
          </h1>

          {/* Price & Stock status */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Tarif Sewa</span>
              <span className="text-2xl font-black text-primary">
                {formatRupiah(product.harga_sewa_per_hari)}
                <span className="text-sm font-normal text-muted-foreground">/hari</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Ketersediaan</span>
              <span className={`text-sm font-bold ${product.stok > 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                {product.stok > 0 ? `${product.stok} Unit Ready` : "Habis Sewa"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-bold text-foreground mb-2">Deskripsi Produk</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.deskripsi}
            </p>
          </div>

          {/* Specifications Table (JSONB rendering) */}
          {Object.keys(product.spesifikasi).length > 0 && (
            <div className="mb-8 bg-card rounded-xl border border-border p-5">
              <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Spesifikasi Teknis
              </h3>
              <div className="border border-border/60 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border/60">
                    {Object.entries(product.spesifikasi).map(([key, value]) => (
                      <tr key={key} className="hover:bg-muted/40">
                        <td className="px-4 py-3 font-semibold text-foreground bg-muted/40 w-1/3 capitalize">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          {product.stok > 0 ? (
            <div className="space-y-4 mt-auto">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-foreground">Jumlah Sewa</span>
                
                <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden shadow-sm">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-bold text-foreground w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stok}
                    className="p-2.5 hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <span className="text-xs text-muted-foreground">
                  Maks. {product.stok} unit
                </span>
              </div>

              {cartFeedback && (
                <p className="flex items-center gap-2 text-sm font-semibold alert-success rounded-lg px-4 py-2.5">
                  <Check className="h-4 w-4 shrink-0" />
                  {quantity}x {product.nama} ditambahkan ke keranjang.
                  <Link href="/cart" className="underline hover:no-underline ml-1">
                    Lihat keranjang
                  </Link>
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full border-2 border-primary text-primary py-3.5 rounded-xl font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  + Keranjang
                </button>
                <button
                  type="button"
                  onClick={handleRentNow}
                  className="w-full bg-accent text-accent-foreground py-3.5 rounded-xl font-bold hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  Sewa Sekarang
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-auto p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold text-center">
              Maaf, barang ini sedang tidak tersedia untuk disewa saat ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
