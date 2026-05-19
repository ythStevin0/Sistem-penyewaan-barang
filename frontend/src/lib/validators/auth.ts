import { z } from "zod";

// Skema validasi untuk Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" }),
});

// Skema validasi untuk Register (Pendaftaran)
export const registerSchema = z
  .object({
    nama_lengkap: z
      .string()
      .min(1, { message: "Nama lengkap wajib diisi" })
      .max(100, { message: "Nama lengkap terlalu panjang" }),
    no_hp: z
      .string()
      .min(10, { message: "Nomor HP minimal 10 digit" })
      .max(15, { message: "Nomor HP maksimal 15 digit" })
      .regex(/^[0-9]+$/, { message: "Nomor HP hanya boleh berisi angka" }),
    alamat: z
      .string()
      .min(10, { message: "Alamat lengkap minimal 10 karakter" })
      .max(500, { message: "Alamat terlalu panjang" }),
    email: z
      .string()
      .min(1, { message: "Email wajib diisi" })
      .email({ message: "Format email tidak valid" }),
    password: z
      .string()
      .min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Konfirmasi password wajib diisi" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// Tipe data TypeScript berdasarkan skema Zod
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
