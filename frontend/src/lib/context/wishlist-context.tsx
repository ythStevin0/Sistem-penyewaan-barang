"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface WishlistContextType {
  ids: Set<string>;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggle: (productId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIds(new Set());
      setIsLoading(false);
      return;
    }

    const { data } = await supabase.from("wishlists").select("product_id").eq("user_id", user.id);

    setIds(new Set((data ?? []).map((r) => r.product_id)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const supabase = createSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => void refresh());
    return () => subscription.unsubscribe();
  }, [refresh]);

  const toggle = useCallback(
    async (productId: string) => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      if (ids.has(productId)) {
        await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
        setIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
        setIds((prev) => new Set(prev).add(productId));
      }
      return true;
    },
    [ids]
  );

  return (
    <WishlistContext.Provider
      value={{
        ids,
        isLoading,
        isInWishlist: (id) => ids.has(id),
        toggle,
        refresh,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
