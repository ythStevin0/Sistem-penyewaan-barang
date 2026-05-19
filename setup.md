# Penjelasan Setup Awal: Next.js & Supabase

Selamat datang! Karena Anda baru pertama kali menggunakan **Next.js** dan **Supabase**, dokumen ini disusun khusus untuk menjelaskan secara detail apa saja yang sudah kita kerjakan dari awal, fungsi setiap file, dan bagaimana alur kerjanya. 

Anggap dokumen ini sebagai "Buku Panduan" agar Anda tidak kebingungan dengan struktur kode yang ada.

---

## 1. Apa Itu Next.js dan Mengapa Kita Menggunakannya?

**Next.js** (khususnya versi 14 dengan *App Router*) adalah framework berbasis React. Jika React biasa hanya berjalan di browser (Client-Side), Next.js memungkinkan aplikasi web Anda di-render di server (Server-Side). Ini membuat website Anda jauh lebih cepat saat pertama kali dimuat dan sangat bagus untuk SEO (mudah dicari Google).

**Langkah yang sudah kita lakukan:**
Kita menjalankan perintah `npx create-next-app@14`. Perintah ini meng-install rangka (boilerplate) dasar Next.js beserta **TypeScript** (agar kode lebih terstruktur dan meminimalisir error) dan **Tailwind CSS** (untuk mempermudah desain/styling dengan class bawaan).

---

## 2. Dependensi Tambahan (Library)
Selain bawaan Next.js, kita juga menginstall beberapa "alat bantu" (library) penting:

- **`@supabase/supabase-js` & `@supabase/ssr`**: Ini adalah SDK resmi dari Supabase agar aplikasi kita bisa berkomunikasi dengan database dan sistem login (Auth) mereka secara aman, baik dari sisi Server maupun Client.
- **`react-hook-form` & `zod`**: Di aplikasi penyewaan, kita pasti akan membuat banyak form (login, register, input barang, booking). *React Hook Form* membantu mengelola input form dengan performa tinggi, sementara *Zod* bertugas mengecek apakah data yang diinput benar (misal: "email harus format email", "harga tidak boleh kosong").
- **`lucide-react`**: Kumpulan ikon modern yang ringan untuk mempercantik UI.
- **`clsx` & `tailwind-merge`**: Utility (alat bantu) untuk menggabungkan class Tailwind secara dinamis tanpa bentrok. File penggabungnya sudah kita buat di `src/lib/utils.ts`.

---

## 3. Struktur Folder yang Kita Bangun
Agar kode tidak berantakan saat aplikasi semakin besar, kita sudah membuat struktur folder di dalam folder `src/`:

- **`src/app/`**: Ini adalah "Jantung" dari Next.js App Router. Setiap folder di sini otomatis menjadi halaman web. (Contoh: folder `src/app/login/` akan bisa diakses di `localhost:3000/login`).
- **`src/components/`**: Tempat menyimpan bagian-bagian kecil dari UI yang bisa dipakai berulang kali.
  - `/ui/`: Untuk tombol, input, card (komponen dasar).
  - `/layout/`: Untuk Navbar (menu atas) dan Footer (menu bawah).
  - `/landing/`, `/auth/`, `/catalog/`: Untuk komponen spesifik per fitur.
- **`src/lib/`**: Tempat menaruh kode-kode logika atau bantuan di luar urusan tampilan UI.
  - `/supabase/`: Berisi pengaturan koneksi ke Supabase.
  - `/format/`: Nanti akan diisi fungsi untuk memformat angka jadi Rupiah (`Rp 10.000`) atau format tanggal.
- **`src/types/`**: Tempat menaruh definisi tipe data TypeScript (agar autocompletion di kode editor Anda jalan dan akurat).
- **`supabase/`**: Folder khusus untuk menyimpan kode struktur database (migrations) dan data dummy (seed).

---

## 4. Penjelasan Setup Supabase (Database & Auth)

**Supabase** adalah alternatif gratis (open-source) dari Firebase. Ia menyediakan Database PostgreSQL, Sistem Login (Auth), dan Penyimpanan File (Storage) dalam satu tempat. 

Berikut adalah file-file Supabase yang sudah kita buat dan apa fungsinya:

### A. Pengaturan Koneksi (Client, Server, Middleware)
Next.js memiliki dua lingkungan jalan: **Server** (tersembunyi dari user) dan **Browser/Client** (komputer user). Oleh karena itu, kita membuat tiga file konektor di `src/lib/supabase/`:

1. **`client.ts`**: Digunakan saat kita ingin mengambil data langsung dari interaksi di browser (misal: user menekan tombol "Refresh Katalog").
2. **`server.ts`**: Digunakan saat Next.js sedang membuat halaman di server sebelum dikirim ke user (misal: mengecek apakah user sudah login sebelum menampilkan halaman dashboard).
3. **`middleware.ts`**: Ini ibarat "Satpam" di gerbang aplikasi. Setiap kali user berpindah halaman, file ini akan mengecek apakah sesi login (cookie) user masih berlaku atau tidak. Jika tidak berlaku, satpam (middleware) akan menendang user kembali ke halaman Login. (File ini dipanggil oleh `middleware.ts` yang ada di luar/root folder).

### B. Struktur Database (Migrations)
File `supabase/migrations/0001_init.sql` berisi perintah SQL untuk merakit kerangka database Anda di Supabase.
- Kita membuat tabel `users` (pelanggan & admin), `categories` (kategori barang), `products` (barang sewaan), `rentals` (data penyewaan/booking), `payments` (pembayaran), dan `reviews` (ulasan).
- **RLS (Row Level Security)**: Ini adalah fitur keamanan sakti dari Supabase. Kita sudah mengaturnya agar *Customer A* tidak bisa melihat tagihan atau data pribadi *Customer B*. Admin, di sisi lain, bisa melihat semuanya.
- **Trigger**: Kita membuat fungsi otomatis; setiap kali ada orang mendaftar lewat sistem Auth Supabase, datanya akan otomatis disalin ke tabel `users` milik kita.

### C. Data Awal (Seed)
File `supabase/seed/seed.sql` berisi "data mainan/dummy". Menginput data satu per satu lewat dashboard sangat melelahkan. File ini bertugas memasukkan daftar kategori (Tenda, Carrier, dll) beserta 12 barang contoh secara otomatis agar saat kita membuat tampilan Katalog nanti, sudah ada barang yang muncul.

---

## 5. Ringkasan Alur Kerja
Jika kita gabungkan semuanya, beginilah cara kerja aplikasi Anda ke depannya:
1. User membuka `localhost:3000`.
2. Next.js (`src/app/page.tsx`) akan membuat tampilannya menggunakan Tailwind CSS.
3. Middleware (`middleware.ts`) akan mengecek cookies untuk melihat apakah user sudah login.
4. Jika halaman butuh data barang, Next.js akan memanggil Supabase lewat `src/lib/supabase/server.ts` untuk mengambil data dari tabel `products` (yang datanya berasal dari file SQL tadi).
5. Data diberikan ke komponen UI dan ditampilkan ke layar User.

## Apa Selanjutnya?
Karena semua pondasi rumit (Database, Auth, Struktur Folder) sudah terpasang kokoh, tahap kita selanjutnya jauh lebih menyenangkan, yaitu: **Membangun Tampilan Antarmuka (UI)!**

Kita akan mulai memberikan warna pada Tailwind, mengatur font, dan mendesain halaman depan (Landing Page) Samidd Outdoor.

Semoga penjelasan ini membantu Anda lebih memahami struktur aplikasi modern ini! Jika ada satu bagian yang masih membuat Anda bingung, jangan ragu untuk bertanya.
