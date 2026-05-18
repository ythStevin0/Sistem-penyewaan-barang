# Panduan Setup Awal Sistem Penyewaan Barang Pendakian (Samidd Outdoor)

Dokumen ini berisi langkah-langkah lengkap untuk melakukan setup awal project dari nol (Tahap 1).

## Langkah 1: Inisialisasi Project Next.js
Kita akan menggunakan Next.js 14 dengan App Router, TypeScript, dan Tailwind CSS.

Jalankan perintah ini di terminal Anda pada folder utama (`c:\penyewaan-barang-outdoor`):

```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
*Catatan: Tambahkan `.` agar project di-install langsung di folder saat ini.*

## Langkah 2: Install Dependensi Tambahan
Project ini membutuhkan beberapa library penting untuk form, validasi, ikon, dan Supabase.

Jalankan perintah berikut:

```bash
# 1. Supabase (Database, Auth, Storage)
npm install @supabase/supabase-js @supabase/ssr

# 2. Form & Validasi (React Hook Form + Zod)
npm install react-hook-form @hookform/resolvers zod

# 3. Ikon
npm install lucide-react

# 4. Utilities untuk UI (Shadcn-style)
npm install clsx tailwind-merge
```

## Langkah 3: Setup Struktur Folder
Sesuai dengan spesifikasi, buat struktur folder di dalam folder `src` dan root:

```bash
# Buat folder-folder utama di dalam src
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/landing
mkdir -p src/components/auth
mkdir -p src/components/catalog

mkdir -p src/lib/supabase
mkdir -p src/lib/format
mkdir -p src/lib/validators

mkdir -p src/types

# Buat folder untuk Supabase Migrations & Seed di root directory
mkdir -p supabase/migrations
mkdir -p supabase/seed
```

## Langkah 4: Konfigurasi Environment Variables
Buat file `.env.local` di root directory project dan isi dengan credential dari dashboard Supabase Anda:

```env
# Dapatkan ini dari Supabase Dashboard -> Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# URL website lokal
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

*Jangan lupa menambahkan `.env.local` ke dalam `.gitignore` agar credential tidak bocor.*

## Langkah 5: Setup Supabase Database
1. Buka [Supabase Dashboard](https://app.supabase.com) dan buat project baru.
2. Buat file `supabase/migrations/0001_init.sql` dan isi dengan skema database lengkap. (Kode SQL akan kita generate selanjutnya).
3. Buat file `supabase/seed/seed.sql` dan isi dengan dummy data.
4. Pergi ke menu **SQL Editor** di Supabase Dashboard, lalu jalankan isi file `0001_init.sql` diikuti dengan `seed.sql`.

## Langkah 6: Konfigurasi Client & Server Supabase
Buat utility file untuk Supabase agar mudah dipanggil di Client dan Server components:

1. Buat `src/lib/supabase/client.ts`
2. Buat `src/lib/supabase/server.ts`
3. Buat `src/lib/supabase/middleware.ts`
4. Buat file `middleware.ts` di root directory (sejajar dengan folder `src`) untuk proteksi route.

## Langkah 7: Jalankan Development Server
Jika semua setup sudah selesai, jalankan perintah:

```bash
npm run dev
```

Buka `http://localhost:3000` di browser Anda. Project sudah siap untuk mulai dikembangkan!
