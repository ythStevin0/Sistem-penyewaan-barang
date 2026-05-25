"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mountain, Search, ShoppingBag, User, LayoutDashboard, LogOut, Loader2, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useCart } from "@/lib/context/cart-context";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { itemCount } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const client = createSupabaseBrowserClient();

    client.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await client
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
      setIsLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await client
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
    setIsSigningOut(false);
  };

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

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/wishlist"
            className="text-muted-foreground hover:text-foreground transition-colors p-2 relative"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Favorit</span>
            {wishlistIds.size > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {wishlistIds.size > 99 ? "99+" : wishlistIds.size}
              </span>
            )}
          </Link>
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

          {isLoadingAuth ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : user ? (
            <div className="flex items-center gap-1">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:flex text-xs font-bold text-accent px-2 py-1 rounded-md bg-accent/10"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-2 transition-colors"
                title="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">Pesanan</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-destructive px-2 py-2 transition-colors disabled:opacity-50"
                title="Keluar"
              >
                {isSigningOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span className="sr-only">Keluar</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
