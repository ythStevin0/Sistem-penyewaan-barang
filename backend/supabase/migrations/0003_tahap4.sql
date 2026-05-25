-- Migration 0003: Wishlist + proses keterlambatan otomatis

-- ---------------------------------------------------------------------------
-- Wishlist
-- ---------------------------------------------------------------------------
CREATE TABLE public.wishlists (
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wishlist"
ON public.wishlists FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users add to own wishlist"
ON public.wishlists FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users remove from own wishlist"
ON public.wishlists FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all wishlists"
ON public.wishlists FOR SELECT
TO authenticated
USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- RPC: proses sewa terlambat + hitung denda 15% per barang per hari
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.process_overdue_rentals()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rental record;
  v_days_late integer;
  v_denda integer;
  v_count integer := 0;
BEGIN
  FOR v_rental IN
    SELECT id, tanggal_selesai
    FROM public.rentals
    WHERE status = 'diambil'
      AND tanggal_selesai < CURRENT_DATE
  LOOP
    v_days_late := CURRENT_DATE - v_rental.tanggal_selesai;

    SELECT COALESCE(
      SUM(ROUND(ri.harga_satuan * 0.15 * ri.jumlah * v_days_late)),
      0
    )::integer
    INTO v_denda
    FROM public.rental_items ri
    WHERE ri.rental_id = v_rental.id;

    UPDATE public.rentals
    SET status = 'terlambat', denda = v_denda, updated_at = now()
    WHERE id = v_rental.id;

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.process_overdue_rentals FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.process_overdue_rentals TO authenticated;
