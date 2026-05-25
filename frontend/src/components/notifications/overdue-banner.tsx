import { AlertTriangle } from "lucide-react";

interface OverdueBannerProps {
  count: number;
  role?: "customer" | "admin";
}

export function OverdueBanner({ count, role = "customer" }: OverdueBannerProps) {
  if (count <= 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex gap-3">
      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-bold text-destructive">
          {count} penyewaan terlambat {role === "admin" ? "terdeteksi" : "pada akun Anda"}
        </p>
        <p className="text-muted-foreground mt-1">
          Denda 15% per barang per hari telah dihitung otomatis. Status diperbarui ke{" "}
          <strong>terlambat</strong>.
        </p>
      </div>
    </div>
  );
}
