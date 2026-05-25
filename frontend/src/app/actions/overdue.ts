"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function processOverdueRentals(): Promise<{ count: number }> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("process_overdue_rentals");

  if (!error) {
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/admin/rentals");
  }

  return { count: error ? 0 : (data as number) ?? 0 };
}
