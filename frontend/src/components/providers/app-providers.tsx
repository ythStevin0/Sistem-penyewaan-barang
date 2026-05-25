"use client";

import { CartProvider } from "@/lib/context/cart-context";
import { ThemeProvider } from "@/lib/context/theme-context";
import { WishlistProvider } from "@/lib/context/wishlist-context";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
