import { z } from "zod";

export const rentalStatusAdminSchema = z.enum([
  "menunggu_pembayaran",
  "dibayar",
  "diambil",
  "selesai",
  "dibatalkan",
  "terlambat",
]);

export const productStatusSchema = z.enum(["tersedia", "disewa", "rusak", "maintenance"]);

export const productFormSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string().uuid(),
  nama: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  deskripsi: z.string().min(1),
  harga_sewa_per_hari: z.coerce.number().int().min(0),
  stok: z.coerce.number().int().min(0),
  status: productStatusSchema,
  gambar_urls: z.string().optional(),
  spesifikasi: z.string().optional(),
});

export const categoryFormSchema = z.object({
  id: z.string().uuid().optional(),
  nama: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  deskripsi: z.string().optional(),
  icon: z.string().optional(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
