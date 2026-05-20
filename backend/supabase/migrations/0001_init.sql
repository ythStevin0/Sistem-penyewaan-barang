-- Migration 0001_init.sql
-- Membuat custom types untuk enum
CREATE TYPE user_role AS ENUM ('admin', 'customer');
CREATE TYPE product_status AS ENUM ('tersedia', 'disewa', 'rusak', 'maintenance');
CREATE TYPE rental_status AS ENUM (
  'menunggu_pembayaran',
  'dibayar',
  'diambil',
  'selesai',
  'dibatalkan',
  'terlambat'
);
CREATE TYPE payment_status AS ENUM ('pending', 'sukses', 'gagal', 'refund');
CREATE TYPE payment_method AS ENUM ('transfer_bank', 'qris', 'tunai');
-- 1. Tabel Users
CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'customer' NOT NULL,
  nama_lengkap text NOT NULL,
  no_hp text,
  alamat text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- 2. Tabel Categories
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama text NOT NULL,
  slug text UNIQUE NOT NULL,
  deskripsi text,
  icon text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- 3. Tabel Products
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  nama text NOT NULL,
  slug text UNIQUE NOT NULL,
  deskripsi text NOT NULL,
  harga_sewa_per_hari integer NOT NULL,
  stok integer DEFAULT 1 NOT NULL,
  status product_status DEFAULT 'tersedia' NOT NULL,
  gambar_urls text [] DEFAULT '{}' NOT NULL,
  spesifikasi jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- 4. Tabel Rentals
CREATE TABLE public.rentals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
  tanggal_mulai date NOT NULL,
  tanggal_selesai date NOT NULL,
  total_harga integer NOT NULL,
  status rental_status DEFAULT 'menunggu_pembayaran' NOT NULL,
  jaminan_ktp_url text,
  catatan text,
  denda integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
-- 5. Tabel Rental Items
CREATE TABLE public.rental_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id uuid REFERENCES public.rentals(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  jumlah integer NOT NULL,
  harga_satuan integer NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.rental_items ENABLE ROW LEVEL SECURITY;
-- 6. Tabel Payments
CREATE TABLE public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id uuid REFERENCES public.rentals(id) ON DELETE CASCADE NOT NULL,
  jumlah integer NOT NULL,
  metode_pembayaran payment_method NOT NULL,
  status payment_status DEFAULT 'pending' NOT NULL,
  bukti_pembayaran_url text,
  waktu_bayar timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
-- 7. Tabel Reviews
CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rental_id uuid REFERENCES public.rentals(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (
    rating >= 1
    AND rating <= 5
  ) NOT NULL,
  komentar text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
-- RLS Policies
-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$ BEGIN RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Users Table Policies
CREATE POLICY "Users can view their own data" ON public.users FOR
SELECT USING (
    auth.uid() = id
    OR public.is_admin()
  );
CREATE POLICY "Users can update their own data" ON public.users FOR
UPDATE USING (
    auth.uid() = id
    OR public.is_admin()
  );
CREATE POLICY "Admins can view all users" ON public.users FOR
SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all users" ON public.users FOR
UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete users" ON public.users FOR DELETE USING (public.is_admin());
-- Categories Policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR
SELECT USING (true);
CREATE POLICY "Categories are insertable by admins" ON public.categories FOR
INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Categories are updatable by admins" ON public.categories FOR
UPDATE USING (public.is_admin());
CREATE POLICY "Categories are deletable by admins" ON public.categories FOR DELETE USING (public.is_admin());
-- Products Policies
CREATE POLICY "Products are viewable by everyone" ON public.products FOR
SELECT USING (true);
CREATE POLICY "Products are insertable by admins" ON public.products FOR
INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Products are updatable by admins" ON public.products FOR
UPDATE USING (public.is_admin());
CREATE POLICY "Products are deletable by admins" ON public.products FOR DELETE USING (public.is_admin());
-- Rentals Policies
CREATE POLICY "Users can view their own rentals" ON public.rentals FOR
SELECT USING (
    auth.uid() = user_id
    OR public.is_admin()
  );
CREATE POLICY "Users can create rentals" ON public.rentals FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rentals" ON public.rentals FOR
UPDATE USING (
    auth.uid() = user_id
    OR public.is_admin()
  );
CREATE POLICY "Admins can view all rentals" ON public.rentals FOR
SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all rentals" ON public.rentals FOR
UPDATE USING (public.is_admin());
-- Rental Items Policies
CREATE POLICY "Users can view their own rental items" ON public.rental_items FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.rentals
      WHERE id = rental_id
        AND user_id = auth.uid()
    )
    OR public.is_admin()
  );
CREATE POLICY "Users can create rental items" ON public.rental_items FOR
INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.rentals
      WHERE id = rental_id
        AND user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can view all rental items" ON public.rental_items FOR
SELECT USING (public.is_admin());
-- Payments Policies
CREATE POLICY "Users can view their own payments" ON public.payments FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.rentals
      WHERE id = rental_id
        AND user_id = auth.uid()
    )
    OR public.is_admin()
  );
CREATE POLICY "Users can create payments" ON public.payments FOR
INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.rentals
      WHERE id = rental_id
        AND user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can update all payments" ON public.payments FOR
UPDATE USING (public.is_admin());
CREATE POLICY "Admins can view all payments" ON public.payments FOR
SELECT USING (public.is_admin());
-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR
SELECT USING (true);
CREATE POLICY "Users can create reviews for their rentals" ON public.reviews FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete any review" ON public.reviews FOR DELETE USING (public.is_admin());
-- Trigger untuk sync auth.users ke public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public.users (id, nama_lengkap, no_hp, alamat, role)
VALUES (
    new.id,
    new.raw_user_meta_data->>'nama_lengkap',
    new.raw_user_meta_data->>'no_hp',
    new.raw_user_meta_data->>'alamat',
    'customer'
  );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- Setup Realtime untuk tabel products dan rentals
ALTER PUBLICATION supabase_realtime
ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.rentals;