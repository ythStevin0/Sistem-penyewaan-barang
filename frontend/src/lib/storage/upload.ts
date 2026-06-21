import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function uploadUserFile(
  supabase: SupabaseClient,
  bucket: "ktp" | "bukti-bayar" | "products",
  folderName: string,
  file: File
): Promise<{ path: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Format file harus JPG, PNG, WebP, atau PDF." };
  }

  if (file.size > MAX_FILE_BYTES) {
    return { error: "Ukuran file maksimal 5 MB." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "pdf"].includes(ext) ? ext : "jpg";
  const path = `${folderName}/${Date.now()}.${safeExt}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return {
      error:
        error.message.includes("Bucket not found")
          ? `Bucket "${bucket}" belum dibuat di Supabase. Jalankan migration 0002.`
          : "Gagal mengunggah file. Coba lagi.",
    };
  }

  return { path };
}
