"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import {
  categoryFormSchema,
  productFormSchema,
  rentalStatusAdminSchema,
} from "@/lib/validators/admin";
import type { RentalStatus } from "@/types/rental";

type ActionResult = { success: true } | { success: false; error: string };

function parseSpecJson(raw?: string): Record<string, unknown> {
  if (!raw?.trim()) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function parseImageUrls(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function verifyPayment(paymentId: string, rentalId: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error: payErr } = await supabase
    .from("payments")
    .update({ status: "sukses", waktu_bayar: new Date().toISOString() })
    .eq("id", paymentId);

  if (payErr) return { success: false, error: "Gagal verifikasi pembayaran." };

  const { error: rentalErr } = await supabase
    .from("rentals")
    .update({ status: "dibayar" })
    .eq("id", rentalId);

  if (rentalErr) return { success: false, error: "Gagal update status sewa." };

  revalidatePath("/admin");
  revalidatePath("/admin/rentals");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function confirmCashPayment(paymentId: string, rentalId: string): Promise<ActionResult> {
  return verifyPayment(paymentId, rentalId);
}

export async function updateRentalStatus(
  rentalId: string,
  status: RentalStatus,
  hariTerlambat?: number
): Promise<ActionResult> {
  const parsed = rentalStatusAdminSchema.safeParse(status);
  if (!parsed.success) return { success: false, error: "Status tidak valid." };

  const { supabase } = await requireAdmin();

  if (status === "dibatalkan") {
    const { data: items } = await supabase
      .from("rental_items")
      .select("product_id, jumlah")
      .eq("rental_id", rentalId);

    for (const item of items ?? []) {
      const { data: product } = await supabase
        .from("products")
        .select("stok")
        .eq("id", item.product_id)
        .single();

      const newStok = (product?.stok ?? 0) + item.jumlah;
      await supabase
        .from("products")
        .update({
          stok: newStok,
          status: newStok > 0 ? "tersedia" : "disewa",
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.product_id);
    }

    await supabase.from("rentals").update({ status: "dibatalkan" }).eq("id", rentalId);
  } else if (status === "terlambat" && hariTerlambat && hariTerlambat > 0) {
    const { data: items } = await supabase
      .from("rental_items")
      .select("harga_satuan, jumlah")
      .eq("rental_id", rentalId);

    const denda = (items ?? []).reduce(
      (sum, item) => sum + Math.round(item.harga_satuan * 0.15 * item.jumlah * hariTerlambat),
      0
    );

    const { error } = await supabase
      .from("rentals")
      .update({ status: "terlambat", denda })
      .eq("id", rentalId);

    if (error) return { success: false, error: "Gagal update denda." };
  } else {
    const { error } = await supabase.from("rentals").update({ status }).eq("id", rentalId);
    if (error) return { success: false, error: "Gagal update status." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/rentals");
  revalidatePath("/dashboard");
  revalidatePath("/catalog");
  return { success: true };
}

export async function getSignedStorageUrl(
  bucket: "ktp" | "bukti-bayar",
  path: string
): Promise<{ url: string } | { error: string }> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 300);
  if (error || !data?.signedUrl) return { error: "Gagal memuat file." };
  return { url: data.signedUrl };
}

export async function upsertProduct(payload: unknown): Promise<ActionResult> {
  const parsed = productFormSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: "Data produk tidak valid." };

  const { supabase } = await requireAdmin();
  const row = {
    category_id: parsed.data.category_id,
    nama: parsed.data.nama,
    slug: parsed.data.slug,
    deskripsi: parsed.data.deskripsi,
    harga_sewa_per_hari: parsed.data.harga_sewa_per_hari,
    stok: parsed.data.stok,
    status: parsed.data.status,
    gambar_urls: parseImageUrls(parsed.data.gambar_urls),
    spesifikasi: parseSpecJson(parsed.data.spesifikasi),
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.id) {
    const { error } = await supabase.from("products").update(row).eq("id", parsed.data.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("products").insert(row);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: "Produk tidak bisa dihapus (mungkin masih dipakai pesanan)." };
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  return { success: true };
}

export async function upsertCategory(payload: unknown): Promise<ActionResult> {
  const parsed = categoryFormSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: "Data kategori tidak valid." };

  const { supabase } = await requireAdmin();
  const row = {
    nama: parsed.data.nama,
    slug: parsed.data.slug,
    deskripsi: parsed.data.deskripsi || null,
    icon: parsed.data.icon || null,
  };

  if (parsed.data.id) {
    const { error } = await supabase.from("categories").update(row).eq("id", parsed.data.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("categories").insert(row);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: "Kategori tidak bisa dihapus (masih ada produk)." };
  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  return { success: true };
}
