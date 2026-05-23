import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Samidd Outdoor",
  description: "Selesaikan pemesanan sewa peralatan pendakian Anda.",
};

export default async function CheckoutPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  return <CheckoutClient userId={user.id} />;
}
