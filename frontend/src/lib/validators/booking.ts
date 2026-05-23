import { z } from "zod";

export const paymentMethodSchema = z.enum(["transfer_bank", "tunai"]);

export const checkoutSchema = z.object({
  metode_pembayaran: paymentMethodSchema,
  catatan: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const bookingItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const createBookingPayloadSchema = z.object({
  items: z.array(bookingItemSchema).min(1),
  tanggal_mulai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tanggal_selesai: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  jaminan_ktp_url: z.string().min(1),
  metode_pembayaran: paymentMethodSchema,
  catatan: z.string().max(500).optional(),
});

export type CreateBookingPayload = z.infer<typeof createBookingPayloadSchema>;
