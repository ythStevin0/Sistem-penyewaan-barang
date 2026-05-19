import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Daftar Akun - Samidd Outdoor",
  description: "Buat akun baru di Samidd Outdoor untuk mulai menyewa alat pendakian gunung.",
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-forest-950">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-forest-950 to-forest-950/90"></div>

      <div className="relative z-10 w-full flex justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
