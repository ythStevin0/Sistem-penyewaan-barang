"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/types";

// --- Types ---
export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  // State
  cartItems: CartItem[];
  startDate: string | null;
  endDate: string | null;
  totalDays: number;
  depositAmount: number;

  // Actions
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setRentalDates: (start: string, end: string) => void;

  // Computed
  subtotal: number;
  grandTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "samidd_cart";
const DATES_STORAGE_KEY = "samidd_dates";

/** Deposit jaminan: 20% dari subtotal sewa */
export const DEPOSIT_RATE = 0.2;

/** Hitung jumlah hari sewa (tanggal mulai & selesai inklusif) */
function calculateDays(start: string, end: string): number {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

// --- Provider ---
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Muat data dari localStorage saat pertama kali komponen di-mount (client-side only)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedDates = localStorage.getItem(DATES_STORAGE_KEY);
      if (savedDates) {
        const { start, end } = JSON.parse(savedDates);
        setStartDate(start);
        setEndDate(end);
      }
    } catch {
      // localStorage tidak tersedia atau data rusak
    }
    setIsHydrated(true);
  }, []);

  // Simpan perubahan keranjang ke localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  // Simpan perubahan tanggal ke localStorage
  useEffect(() => {
    if (isHydrated && startDate && endDate) {
      localStorage.setItem(DATES_STORAGE_KEY, JSON.stringify({ start: startDate, end: endDate }));
    }
  }, [startDate, endDate, isHydrated]);

  // --- Computed values ---
  const totalDays = startDate && endDate ? calculateDays(startDate, endDate) : 0;

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + item.product.harga_sewa_per_hari * item.quantity * totalDays;
  }, 0);

  const depositAmount =
    cartItems.length > 0 && subtotal > 0 ? Math.round(subtotal * DEPOSIT_RATE) : 0;
  const grandTotal = subtotal + depositAmount;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- Actions ---
  const addToCart = useCallback((product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        // Update kuantitas jika barang sudah ada
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stok), // Tidak melebihi stok
        };
        return updated;
      }
      // Tambah barang baru
      return [...prev, { product, quantity: Math.min(quantity, product.stok) }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stok)) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setStartDate(null);
    setEndDate(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(DATES_STORAGE_KEY);
  }, []);

  const setRentalDates = useCallback((start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        startDate,
        endDate,
        totalDays,
        depositAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setRentalDates,
        subtotal,
        grandTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// --- Hook ---
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
