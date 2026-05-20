"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, Tent } from "lucide-react";
import type { Product, Category } from "@/types";
import { ProductCard } from "./product-card";

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
}

type SortOption = "terbaru" | "harga_terendah" | "harga_tertinggi";

export function CatalogClient({ initialProducts, categories }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("terbaru");

  // Filter dan Sort Produk secara realtime di sisi client
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Filter Kategori
    if (selectedCategoryId) {
      result = result.filter((p) => p.category_id === selectedCategoryId);
    }

    // 2. Filter Pencarian
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nama.toLowerCase().includes(query) ||
          p.deskripsi.toLowerCase().includes(query)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "harga_terendah") {
        return a.harga_sewa_per_hari - b.harga_sewa_per_hari;
      }
      if (sortBy === "harga_tertinggi") {
        return b.harga_sewa_per_hari - a.harga_sewa_per_hari;
      }
      // Default: terbaru
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [initialProducts, selectedCategoryId, searchQuery, sortBy]);

  return (
    <div className="container py-8">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-950 flex items-center gap-2">
            <Tent className="h-8 w-8 text-primary" />
            Katalog Peralatan
          </h1>
          <p className="text-muted-foreground mt-1">
            Sewa perlengkapan terbaik untuk kenyamanan petualangan Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter (Desktop) */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Pencarian */}
          <div className="bg-white p-5 rounded-xl border border-border">
            <h3 className="font-bold text-forest-950 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Search className="h-4 w-4 text-primary" />
              Cari Alat
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Tenda, Carrier, Jaket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Kategori */}
          <div className="bg-white p-5 rounded-xl border border-border">
            <h3 className="font-bold text-forest-950 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Kategori
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-2 text-left rounded-lg text-sm font-semibold transition-all ${
                  selectedCategoryId === null
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-forest-50/50 hover:bg-forest-50 text-forest-800"
                }`}
              >
                Semua Barang
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`px-4 py-2 text-left rounded-lg text-sm font-semibold transition-all ${
                    selectedCategoryId === category.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-forest-50/50 hover:bg-forest-50 text-forest-800"
                  }`}
                >
                  {category.nama}
                </button>
              ))}
            </div>
          </div>

          {/* Pengurutan */}
          <div className="bg-white p-5 rounded-xl border border-border">
            <h3 className="font-bold text-forest-950 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ArrowUpDown className="h-4 w-4 text-primary" />
              Urutkan
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            >
              <option value="terbaru">Terbaru</option>
              <option value="harga_terendah">Harga Terendah</option>
              <option value="harga_tertinggi">Harga Tertinggi</option>
            </select>
          </div>
        </aside>

        {/* Grid Produk */}
        <main className="lg:col-span-3">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-12 text-center flex flex-col items-center justify-center">
              <Tent className="h-16 w-16 text-muted-foreground mb-4 stroke-1 animate-pulse" />
              <h3 className="text-xl font-bold text-forest-950 mb-2">Barang Tidak Ditemukan</h3>
              <p className="text-muted-foreground max-w-md">
                Maaf, perlengkapan yang Anda cari tidak tersedia. Coba ubah kata kunci atau ganti filter kategori.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
