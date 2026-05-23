import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Masuk - Samidd Outdoor",
  description: "Masuk ke akun Samidd Outdoor Anda untuk melakukan penyewaan barang.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-forest-950">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-forest-950 to-forest-950/90"></div>

      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={<div className="text-white text-sm">Memuat...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
