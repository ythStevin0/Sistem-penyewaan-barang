"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/context/wishlist-context";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const router = useRouter();
  const { isInWishlist, toggle, isLoading } = useWishlist();
  const [pending, setPending] = useState(false);
  const active = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPending(true);
    const ok = await toggle(productId);
    setPending(false);
    if (!ok) router.push("/login?redirect=/wishlist");
  };

  return (
    <button
      type="button"
      onClick={(e) => void handleClick(e)}
      disabled={isLoading || pending}
      className={cn(
        "p-2 rounded-full bg-card/95 shadow-sm border border-border hover:scale-105 transition-all disabled:opacity-50",
        className
      )}
      aria-label={active ? "Hapus dari favorit" : "Tambah ke favorit"}
    >
      <Heart
        className={cn("h-4 w-4", active ? "fill-accent text-accent" : "text-muted-foreground")}
      />
    </button>
  );
}
