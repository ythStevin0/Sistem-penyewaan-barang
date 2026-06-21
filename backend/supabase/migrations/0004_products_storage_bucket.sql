-- Migration 0004: Create products storage bucket

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true, -- Produk harus public agar bisa dilihat siapa saja
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: products
CREATE POLICY "Admins can upload products images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products'
  AND public.is_admin()
);

CREATE POLICY "Admins can update products images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Admins can delete products images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Everyone can read products images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');
