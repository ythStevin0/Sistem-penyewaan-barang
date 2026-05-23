"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createBookingPayloadSchema } from "@/lib/validators/booking";

export type CreateBookingResult =
  | { success: true; rentalId: string }
  | { success: false; error: string };

export async function createBooking(
  payload: unknown
): Promise<CreateBookingResult> {
  const parsed = createBookingPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: "Data pemesanan tidak valid." };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus login untuk memesan." };
  }

  const { data, error } = await supabase.rpc("create_booking", {
    p_items: parsed.data.items,
    p_tanggal_mulai: parsed.data.tanggal_mulai,
    p_tanggal_selesai: parsed.data.tanggal_selesai,
    p_jaminan_ktp_url: parsed.data.jaminan_ktp_url,
    p_metode_pembayaran: parsed.data.metode_pembayaran,
    p_catatan: parsed.data.catatan ?? null,
  });

  if (error) {
    const message =
      error.message.includes("Stok")
        ? "Stok salah satu barang tidak mencukupi. Periksa keranjang Anda."
        : error.message.includes("login")
          ? "Sesi login habis. Silakan masuk kembali."
          : error.message;

    return { success: false, error: message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/catalog");

  return { success: true, rentalId: data as string };
}

export type UploadPaymentProofResult =
  | { success: true }
  | { success: false; error: string };

export async function attachPaymentProof(
  paymentId: string,
  buktiPath: string
): Promise<UploadPaymentProofResult> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus login." };
  }

  const { error } = await supabase
    .from("payments")
    .update({ bukti_pembayaran_url: buktiPath })
    .eq("id", paymentId);

  if (error) {
    return { success: false, error: "Gagal menyimpan bukti pembayaran." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
