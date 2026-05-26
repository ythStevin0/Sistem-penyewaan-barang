import type { PaymentMethod, RentalStatus } from "@/types/rental";

export const rentalStatusLabels: Record<RentalStatus, string> = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  dibayar: "Sudah Dibayar",
  diambil: "Sedang Disewa",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  terlambat: "Terlambat",
};

export const rentalStatusColors: Record<RentalStatus, string> = {
  menunggu_pembayaran:
    "bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-200",
  dibayar: "bg-blue-500/15 text-blue-800 border-blue-500/30 dark:text-blue-200",
  diambil: "bg-primary/15 text-primary border-primary/30 dark:text-primary",
  selesai: "bg-green-500/15 text-green-800 border-green-500/30 dark:text-green-300",
  dibatalkan:
    "bg-muted text-muted-foreground border-border",
  terlambat: "bg-destructive/15 text-destructive border-destructive/30",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  transfer_bank: "Transfer Bank",
  qris: "QRIS",
  tunai: "Tunai di Lokasi",
};
