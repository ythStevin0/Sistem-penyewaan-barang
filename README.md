# Sistem Penyewaan Barang Pendakian — Samidd Outdoor
 
Aplikasi web untuk membantu mitra usaha **Samidd Outdoor** mengelola
penyewaan peralatan pendakian (tenda, carrier, sleeping bag, matras, kompor,
nesting, headlamp, trekking pole). Dibangun dengan stack modern:
 
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **Shadcn-style** UI primitives
- **Supabase** (Postgres + Auth + Realtime + Storage)
- **React Hook Form** + **Zod** untuk form & validasi
- **Lucide React** untuk ikon
 
> Project ini dikerjakan bertahap. README ini menjelaskan Tahap 1
> (fondasi: setup, schema DB, auth, landing page, katalog & detail produk
> dengan realtime). Tahap selanjutnya akan menambahkan booking flow,
> dashboard customer, dashboard admin, dan fitur-fitur lanjutan.
 
---
 
## Daftar Isi
 
1. [Struktur Folder](#struktur-folder)
2. [Prasyarat](#prasyarat)
3. [Setup Supabase](#setup-supabase)
4. [Menjalankan Project Secara Lokal](#menjalankan-project-secara-lokal)
5. [Skema Database](#skema-database)
6. [Sistem Autentikasi](#sistem-autentikasi)
7. [Realtime](#realtime)
8. [Deployment](#deployment)
9. [Roadmap Tahap Berikutnya](#roadmap-tahap-berikutnya)
 
---
 
## Struktur Folder
 
```
.
├── middleware.ts                 # Refresh session + proteksi route
├── next.config.mjs               # Konfigurasi Next.js (image hosts, dst)
├── tailwind.config.ts            # Tema warna outdoor (forest, ember)
├── postcss.config.mjs            # Pipeline Tailwind
├── supabase/
│   ├── migrations/
│   │   └── 0001_init.sql         # Tabel + enum + RLS + trigger
│   └── seed/
│       └── seed.sql              # Dummy data (kategori & produk)
└── src/
    ├── app/
    │   ├── layout.tsx            # Root layout (navbar, footer, providers)
    │   ├── globals.css           # Theme tokens + utility class
    │   ├── page.tsx              # Landing page
    │   ├── login/page.tsx        # Halaman login
    │   ├── register/page.tsx     # Halaman register
    │   ├── catalog/page.tsx      # Katalog produk (server) + grid (client)
    │   └── produk/[slug]/        # Detail produk + 404 lokal
    ├── components/
    │   ├── ui/                   # Komponen primitif (Button, Card, ...)
    │   ├── layout/               # Navbar & Footer
    │   ├── landing/              # Section landing page (Hero, Features, ...)
    │   ├── auth/                 # Form login & register, providers
    │   └── catalog/              # ProductCard, CatalogGrid, ProductDetail
    ├── lib/
    │   ├── supabase/             # Client browser, server, middleware helper
    │   ├── format/               # Util format Rupiah & tanggal
    │   ├── validators/           # Skema Zod
    │   └── utils.ts              # `cn` (class-name merger)
    └── types/
        └── database.ts           # Tipe baris tabel (selaras dgn skema SQL)
```
 
Setiap file diberi komentar berbahasa Indonesia agar mudah dipelajari.
 
---
 
## Prasyarat
 
- **Node.js** 18+ (direkomendasikan 20+)
- **npm** 9+ (atau pnpm / yarn jika lebih nyaman)
- Akun **Supabase** — bisa daftar gratis di [supabase.com](https://supabase.com)
 
---
 
## Setup Supabase
 
1. Login ke [Supabase Dashboard](https://app.supabase.com/) lalu klik
   **New project**. Isi nama (mis. `samidd-outdoor`), pilih region terdekat,
   dan tentukan password database.
2. Setelah project ready, buka:
   - **Project Settings → API** untuk menyalin:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (RAHASIA, hanya
       dipakai di server)
3. Buka **SQL Editor**, klik **New query**, paste seluruh isi
   `supabase/migrations/0001_init.sql`, lalu klik **Run**. Migration ini
   membuat:
   - Tabel `users`, `categories`, `products`, `rentals`, `rental_items`,
     `payments`, `reviews`
   - Enum `user_role`, `product_status`, `rental_status`, dst.
   - Trigger `on_auth_user_created` (otomatis membuat row di
     `public.users` saat ada user baru di Supabase Auth)
   - Helper `public.is_admin()`
   - Row Level Security (RLS) policy lengkap
   - Menambahkan `products` & `rentals` ke publication `supabase_realtime`
4. Jalankan juga `supabase/seed/seed.sql` untuk mengisi 8 kategori +
   12 produk dummy (Tenda, Carrier, Sleeping Bag, dll).
5. (Opsional) **Authentication → Providers → Email**: matikan
   "Confirm email" jika ingin langsung login tanpa verifikasi email
   (mempermudah development).
6. (Opsional) **Storage → New bucket**: buat bucket bernama `ktp` untuk
   jaminan KTP dan `bukti-bayar` untuk bukti pembayaran (akan dipakai di
   Tahap 2).
 
### Membuat akun admin pertama
 
1. Jalankan dev server (lihat bagian selanjutnya), buka `/register`, daftar
   dengan email yang ingin dijadikan admin.
2. Di Supabase Dashboard, buka **SQL Editor** lalu jalankan:
 
   ```sql
   update public.users
   set role = 'admin'
   where email = 'admin@samidd.id';  -- ganti dengan email Anda
   ```
 
3. Logout & login ulang, sekarang user tersebut sudah punya akses ke
   `/admin` (akan dibangun di Tahap 3).
 
---
 
## Menjalankan Project Secara Lokal
 
1. **Install dependencies**:
 
   ```bash
   npm install
   ```
 
2. **Copy env file** dan isi credential Supabase:
 
   ```bash
   cp .env.example .env.local
   # lalu edit .env.local
   ```
 
3. **Jalankan dev server**:
 
   ```bash
   npm run dev
   ```
 
4. Buka [http://localhost:3000](http://localhost:3000).
 
### Script lain
 
| Command            | Kegunaan                                |
|--------------------|-----------------------------------------|
| `npm run dev`      | Dev server dengan hot reload            |
| `npm run build`    | Build production                        |
| `npm run start`    | Menjalankan hasil build                 |
| `npm run lint`     | ESLint                                  |
| `npm run typecheck`| TypeScript check tanpa emit             |
 
---
 
## Skema Database
 
Lihat `supabase/migrations/0001_init.sql` untuk detail penuh. Ringkasan
hubungan:
 
```
auth.users (Supabase Auth)
   └─1:1─► public.users
                ├──< rentals ──< rental_items >── products >── categories
                │                    │
                │                    └──< payments
                └──< reviews >── products
```
 
Beberapa keputusan desain:
 
- `spesifikasi` di tabel `products` disimpan sebagai `jsonb` agar
  fleksibel (mis. `{ "kapasitas": "4 orang", "berat": "2.4 kg" }`).
- `total_harga` di `rentals` disimpan denormalized supaya snapshot
  harga saat booking tidak berubah meski harga produk berubah.
- Semua tabel mengaktifkan **RLS**. Anon hanya bisa SELECT
  `categories`, `products`, `reviews`. Customer hanya bisa lihat /
  modifikasi data miliknya. Admin (ditentukan via fungsi
  `public.is_admin()`) bisa mengelola semuanya.
 
---
 
## Sistem Autentikasi
 
- `src/lib/supabase/client.ts` — client untuk Client Components
  (browser). Session disimpan di cookie via `@supabase/ssr`.
- `src/lib/supabase/server.ts` — client untuk Server Components,
  Route Handlers, dan Server Actions.
- `src/lib/supabase/middleware.ts` + `middleware.ts` — me-refresh
  session di setiap request dan memproteksi route:
  - `/login`, `/register`: redirect ke `/catalog` jika sudah login.
  - `/dashboard`, `/booking`, `/admin`: harus login.
  - `/admin/**`: hanya untuk user dengan `role = 'admin'`.
 
Saat user berhasil register, trigger PostgreSQL `handle_new_user`
otomatis menyalin nama/email/nomor_hp/alamat dari `raw_user_meta_data`
ke `public.users` dengan role default `customer`.
 
---
 
## Realtime
 
Realtime diaktifkan untuk tabel `products` dan `rentals` di SQL migration.
Di sisi client kita subscribe lewat:
 
```ts
const supabase = createSupabaseBrowserClient();
supabase
  .channel("public:products")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "products" },
    () => fetchProducts())
  .subscribe();
```
 
Implementasi nyata bisa dilihat di:
 
- `src/components/catalog/catalog-grid.tsx` — re-fetch list saat ada
  perubahan stok/status produk.
- `src/components/catalog/product-detail.tsx` — update stok produk
  & review baru di halaman detail.
 
---
 
## Deployment
 
### Frontend → Vercel
 
1. Push repository ke GitHub.
2. Buka [vercel.com](https://vercel.com), klik **New Project**, pilih
   repo `Sistem-penyewaan-barang`.
3. Pada step Environment Variables, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (URL hasil deploy)
4. Klik **Deploy**.
 
### Backend → Supabase (sudah cloud)
 
Database, Auth, Realtime, dan Storage berjalan di Supabase. Tidak ada
deployment tambahan. Cukup pastikan migration & seed sudah dijalankan
sesuai bagian [Setup Supabase](#setup-supabase).
 
---
 
## Roadmap Tahap Berikutnya
 
- **Tahap 2 — Booking & Customer**
  - Form booking (pilih tanggal sewa/kembali, qty, upload KTP)
  - Perhitungan total otomatis + reduksi stok via Server Action
  - Dashboard customer (riwayat penyewaan, status pembayaran, denda)
  - Upload bukti pembayaran ke Supabase Storage
 
- **Tahap 3 — Dashboard Admin**
  - CRUD produk & kategori
  - Verifikasi booking, update status pengembalian
  - Statistik penyewaan (chart pendapatan, barang terpopuler)
  - Daftar penyewa beserta jaminan KTP
 
- **Tahap 4 — Fitur Tambahan**
  - Wishlist & favorit
  - Dark mode toggle
  - QR code transaksi
  - Notifikasi keterlambatan + perhitungan denda otomatis
