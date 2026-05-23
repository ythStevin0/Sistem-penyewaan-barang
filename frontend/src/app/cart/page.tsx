import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Keranjang Sewa | Samidd Outdoor",
  description: "Review peralatan pendakian yang akan disewa dan atur periode sewa Anda.",
};

export default function CartPage() {
  return <CartPageClient />;
}
