"use client";

import Link from "next/link";
import { Mountain, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";

export function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Mountain className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary">
            Samidd<span className="text-accent">Outdoor</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Beranda
          </Link>
          <Link
            href="/catalog"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Katalog
          </Link>
          <Link
            href="/cara-sewa"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Cara Sewa
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </button>
          <Link
            href="/cart"
            className="text-muted-foreground hover:text-foreground transition-colors p-2 relative"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Keranjang</span>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <User className="h-4 w-4" />
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}
