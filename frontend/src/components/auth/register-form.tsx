"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";

export function RegisterForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nama_lengkap: "",
      no_hp: "",
      alamat: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nama_lengkap: data.nama_lengkap,
            no_hp: data.no_hp,
            alamat: data.alamat,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Check if session exists (auto sign-in is active)
      if (signUpData.session) {
        setSuccess("Pendaftaran berhasil! Mengarahkan Anda...");
        setTimeout(() => {
          router.push("/catalog");
          router.refresh();
        }, 1500);
      } else {
        setSuccess("Pendaftaran berhasil! Silakan periksa email Anda untuk melakukan verifikasi akun.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 rounded-2xl glass shadow-xl border border-white/25">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-forest-950">Buat Akun Baru</h2>
        <p className="text-muted-foreground mt-2 text-sm">Lengkapi data untuk menikmati layanan sewa kami</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-forest-900 mb-1" htmlFor="nama_lengkap">
              Nama Lengkap
            </label>
            <input
              id="nama_lengkap"
              type="text"
              placeholder="Joko Susilo"
              disabled={isLoading || !!success}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              {...register("nama_lengkap")}
            />
            {errors.nama_lengkap && (
              <p className="text-destructive text-xs mt-1 font-medium">{errors.nama_lengkap.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-forest-900 mb-1" htmlFor="no_hp">
              Nomor HP (WhatsApp)
            </label>
            <input
              id="no_hp"
              type="text"
              placeholder="081234567890"
              disabled={isLoading || !!success}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              {...register("no_hp")}
            />
            {errors.no_hp && (
              <p className="text-destructive text-xs mt-1 font-medium">{errors.no_hp.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-forest-900 mb-1" htmlFor="alamat">
            Alamat Lengkap (KTP)
          </label>
          <textarea
            id="alamat"
            placeholder="Jl. Merdeka No. 12, RT 01/RW 02, Kec. Klojen, Malang"
            disabled={isLoading || !!success}
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 resize-none"
            {...register("alamat")}
          />
          {errors.alamat && (
            <p className="text-destructive text-xs mt-1 font-medium">{errors.alamat.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-forest-900 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="nama@email.com"
            disabled={isLoading || !!success}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-forest-900 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading || !!success}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-xs mt-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-forest-900 mb-1" htmlFor="confirmPassword">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isLoading || !!success}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!success}
          className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-55 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Daftar Akun"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Sudah punya akun? </span>
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
