export interface Category {
  id: string;
  nama: string;
  slug: string;
  deskripsi?: string;
  icon?: string;
  created_at: string;
}

export type ProductStatus = 'tersedia' | 'disewa' | 'rusak' | 'maintenance';

export interface Product {
  id: string;
  category_id: string;
  nama: string;
  slug: string;
  deskripsi: string;
  harga_sewa_per_hari: number;
  stok: number;
  status: ProductStatus;
  gambar_urls: string[];
  spesifikasi: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  categories?: Category; // Join relation
}
