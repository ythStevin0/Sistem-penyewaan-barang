export type RentalStatus =
  | "menunggu_pembayaran"
  | "dibayar"
  | "diambil"
  | "selesai"
  | "dibatalkan"
  | "terlambat";

export type PaymentStatus = "pending" | "sukses" | "gagal" | "refund";

export type PaymentMethod = "transfer_bank" | "qris" | "tunai";

export interface RentalItem {
  id: string;
  rental_id: string;
  product_id: string;
  jumlah: number;
  harga_satuan: number;
  created_at: string;
  products?: {
    nama: string;
    slug: string;
    gambar_urls: string[];
  };
}

export interface Payment {
  id: string;
  rental_id: string;
  jumlah: number;
  metode_pembayaran: PaymentMethod;
  status: PaymentStatus;
  bukti_pembayaran_url: string | null;
  waktu_bayar: string | null;
  created_at: string;
}

export interface Rental {
  id: string;
  user_id: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  total_harga: number;
  status: RentalStatus;
  jaminan_ktp_url: string | null;
  catatan: string | null;
  denda: number;
  created_at: string;
  rental_items?: RentalItem[];
  payments?: Payment[];
}
