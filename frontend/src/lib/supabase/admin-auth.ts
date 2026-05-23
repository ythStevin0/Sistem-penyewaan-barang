import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

export async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("users")
    .select("role, nama_lengkap")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/catalog");

  return { supabase, user, profile };
}
