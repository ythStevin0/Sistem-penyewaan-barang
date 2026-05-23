"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/catalog";
  const supabase = createSupabaseBrowserClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        setError(authError.message === "Invalid login credentials" 
          ? "Email atau password salah." 
          : authError.message
        );
        return;
      }

      router.push(redirectTo.startsWith("/") ? redirectTo : "/catalog");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl glass shadow-xl border border-white/25">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-forest-950">Selamat Datang</h2>
        <p className="text-muted-foreground mt-2 text-sm">Masuk untuk mulai menyewa alat pendakian</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-forest-900 mb-1.5" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="nama@email.com"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-forest-900 mb-1.5" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-xs mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-55"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Belum punya akun? </span>
        <Link href="/register" className="text-primary font-semibold hover:underline">
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
