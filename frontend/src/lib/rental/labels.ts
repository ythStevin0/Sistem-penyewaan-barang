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
  menunggu_pembayaran: "bg-amber-100 text-amber-800 border-amber-200",
  dibayar: "bg-blue-100 text-blue-800 border-blue-200",
  diambil: "bg-primary/10 text-primary border-primary/20",
  selesai: "bg-green-100 text-green-800 border-green-200",
  dibatalkan: "bg-gray-100 text-gray-700 border-gray-200",
  terlambat: "bg-destructive/10 text-destructive border-destructive/20",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  transfer_bank: "Transfer Bank",
  qris: "QRIS",
  tunai: "Tunai di Lokasi",
};
