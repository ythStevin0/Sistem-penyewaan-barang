-- Migration 0002: RPC booking atomik + bucket storage KTP & bukti bayar

-- ---------------------------------------------------------------------------
-- RPC: create_booking — insert rental, items, payment, kurangi stok
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_booking(
  p_items jsonb,
  p_tanggal_mulai date,
  p_tanggal_selesai date,
  p_jaminan_ktp_url text,
  p_metode_pembayaran payment_method,
  p_catatan text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_rental_id uuid;
  v_days integer;
  v_subtotal integer := 0;
  v_deposit integer;
  v_total integer;
  v_item jsonb;
  v_product_id uuid;
  v_qty integer;
  v_price integer;
  v_stok integer;
  v_item_count integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Anda harus login untuk memesan';
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Keranjang kosong';
  END IF;

  IF p_jaminan_ktp_url IS NULL OR length(trim(p_jaminan_ktp_url)) = 0 THEN
    RAISE EXCEPTION 'Upload KTP wajib untuk setiap pemesanan';
  END IF;

  IF p_tanggal_selesai < p_tanggal_mulai THEN
    RAISE EXCEPTION 'Tanggal kembali tidak boleh sebelum tanggal mulai';
  END IF;

  IF p_tanggal_mulai < CURRENT_DATE THEN
    RAISE EXCEPTION 'Tanggal mulai tidak boleh di masa lalu';
  END IF;

  v_days := (p_tanggal_selesai - p_tanggal_mulai) + 1;

  -- Validasi stok & hitung subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    IF v_qty IS NULL OR v_qty < 1 THEN
      RAISE EXCEPTION 'Jumlah barang tidak valid';
    END IF;

    SELECT harga_sewa_per_hari, stok
    INTO v_price, v_stok
    FROM public.products
    WHERE id = v_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produk tidak ditemukan';
    END IF;

    IF v_stok < v_qty THEN
      RAISE EXCEPTION 'Stok tidak mencukupi';
    END IF;

    v_subtotal := v_subtotal + (v_price * v_qty * v_days);
  END LOOP;

  v_deposit := round(v_subtotal * 0.2);
  v_total := v_subtotal + v_deposit;

  INSERT INTO public.rentals (
    user_id,
    tanggal_mulai,
    tanggal_selesai,
    total_harga,
    status,
    jaminan_ktp_url,
    catatan
  )
  VALUES (
    v_user_id,
    p_tanggal_mulai,
    p_tanggal_selesai,
    v_total,
    'menunggu_pembayaran',
    p_jaminan_ktp_url,
    p_catatan
  )
  RETURNING id INTO v_rental_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    SELECT harga_sewa_per_hari INTO v_price
    FROM public.products
    WHERE id = v_product_id
    FOR UPDATE;

    INSERT INTO public.rental_items (rental_id, product_id, jumlah, harga_satuan)
    VALUES (v_rental_id, v_product_id, v_qty, v_price);

    UPDATE public.products
    SET
      stok = stok - v_qty,
      status = CASE WHEN stok - v_qty <= 0 THEN 'disewa'::product_status ELSE status END,
      updated_at = now()
    WHERE id = v_product_id;
  END LOOP;

  INSERT INTO public.payments (rental_id, jumlah, metode_pembayaran, status)
  VALUES (v_rental_id, v_total, p_metode_pembayaran, 'pending');

  RETURN v_rental_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_booking TO authenticated;

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ktp',
  'ktp',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bukti-bayar',
  'bukti-bayar',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Storage policies: KTP
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can upload own KTP"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ktp'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own KTP"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'ktp'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can read all KTP"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'ktp' AND public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage policies: bukti bayar
-- ---------------------------------------------------------------------------
CREATE POLICY "Users can upload own payment proof"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bukti-bayar'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own payment proof"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'bukti-bayar'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can read all payment proof"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'bukti-bayar' AND public.is_admin());

-- Policy agar user bisa update payment miliknya (upload bukti)
CREATE POLICY "Users can update their own payments"
ON public.payments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.rentals r
    WHERE r.id = rental_id AND r.user_id = auth.uid()
  )
);
