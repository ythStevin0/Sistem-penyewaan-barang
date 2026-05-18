-- Seed Data
-- 1. Categories
INSERT INTO public.categories (id, nama, slug, deskripsi, icon) VALUES
('b27cd5b4-d57e-40af-a8cc-756ef26e5fc5', 'Tenda', 'tenda', 'Tenda dome, tunnel, dan geodetic', 'tent'),
('e3b5e43c-66f8-45a7-96a6-38b8132cb071', 'Carrier', 'carrier', 'Tas gunung / ransel pendakian', 'backpack'),
('9b7b4a2c-fdb0-4384-9fb6-46b0a8f89e24', 'Sleeping Bag', 'sleeping-bag', 'Kantong tidur untuk berbagai suhu', 'bed'),
('7b56f8f5-3c13-41dc-bb92-0b81c2f5d91c', 'Matras', 'matras', 'Matras foil, spon, dan angin', 'layers'),
('f8f5c9a7-8a6c-48c9-bc8a-d162985333f2', 'Kompor & Nesting', 'kompor-nesting', 'Alat masak portabel', 'flame'),
('10a0e9fc-e9ab-48e0-a7d1-3bc420a969b8', 'Penerangan', 'penerangan', 'Headlamp dan senter tenda', 'flashlight'),
('30cfd8e1-5e7e-417d-9481-91a6fc8b9756', 'Sepatu Trekking', 'sepatu-trekking', 'Sepatu gunung tahan air dan anti slip', 'footprints'),
('c389d4ab-2a5a-4cb4-81d0-b749d68b92b6', 'Trekking Pole', 'trekking-pole', 'Tongkat bantu jalan pendakian', 'activity');

-- 2. Products
INSERT INTO public.products (id, category_id, nama, slug, deskripsi, harga_sewa_per_hari, stok, status, spesifikasi) VALUES
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'b27cd5b4-d57e-40af-a8cc-756ef26e5fc5', 'Tenda Rei 4 Orang', 'tenda-rei-4-orang', 'Tenda dome double layer cocok untuk 4-5 orang. Anti badai dan embun.', 35000, 5, 'tersedia', '{"kapasitas": "4 Orang", "berat": "3.5 kg", "layer": "Double"}'),
('b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e', 'b27cd5b4-d57e-40af-a8cc-756ef26e5fc5', 'Tenda Eiger 2 Orang', 'tenda-eiger-2-orang', 'Tenda ringan untuk 2 orang, sangat pas untuk fast packing.', 30000, 3, 'tersedia', '{"kapasitas": "2 Orang", "berat": "2 kg", "layer": "Double"}'),
('c3d4e5f6-a7b8-6c7d-ae9f-1a2b3c4d5e6f', 'e3b5e43c-66f8-45a7-96a6-38b8132cb071', 'Carrier Consina 60L', 'carrier-consina-60l', 'Tas carrier ukuran 60 liter dengan backsystem nyaman.', 25000, 10, 'tersedia', '{"kapasitas": "60 Liter", "berat": "1.5 kg", "warna": "Hitam/Biru"}'),
('d4e5f6a7-b8c9-7d8e-bfa0-2b3c4d5e6f7a', '9b7b4a2c-fdb0-4384-9fb6-46b0a8f89e24', 'Sleeping Bag Polar Bulu', 'sleeping-bag-polar-bulu', 'Sleeping bag dengan lapisan dalam polar bulu sangat hangat untuk gunung ketinggian 3000mdpl+.', 15000, 15, 'tersedia', '{"suhu_nyaman": "5°C", "berat": "800 gram", "model": "Mummy"}'),
('e5f6a7b8-c9d0-8e9f-c0b1-3c4d5e6f7a8b', '7b56f8f5-3c13-41dc-bb92-0b81c2f5d91c', 'Matras Spon Karet', 'matras-spon-karet', 'Matras spon standar untuk alas tidur dalam tenda.', 5000, 20, 'tersedia', '{"panjang": "180 cm", "lebar": "60 cm", "tebal": "3 mm"}'),
('f6a7b8c9-d0e1-9fa0-d1c2-4d5e6f7a8b9c', 'f8f5c9a7-8a6c-48c9-bc8a-d162985333f2', 'Kompor Kotak Portabel', 'kompor-kotak-portabel', 'Kompor gas kotak portabel mudah digunakan (belum termasuk gas kaleng).', 10000, 8, 'tersedia', '{"berat": "400 gram", "jenis_gas": "Hi-Cook/Canister"}'),
('0a1b2c3d-4e5f-a0b1-e2d3-5e6f7a8b9c0d', 'f8f5c9a7-8a6c-48c9-bc8a-d162985333f2', 'Nesting 4 Set', 'nesting-4-set', 'Alat masak nesting terdiri dari 2 panci dan 2 tutup/penggorengan.', 15000, 6, 'tersedia', '{"bahan": "Aluminium Anodized", "berat": "600 gram", "isi": "4 Pcs"}'),
('1b2c3d4e-5f6a-b1c2-f3e4-6f7a8b9c0d1e', '10a0e9fc-e9ab-48e0-a7d1-3bc420a969b8', 'Headlamp Energizer', 'headlamp-energizer', 'Senter kepala dengan 3 mode terang. Termasuk baterai AAA 3pcs.', 10000, 12, 'tersedia', '{"lumens": "150", "baterai": "3x AAA", "mode": "Terang/Redup/Kedip"}'),
('2c3d4e5f-6a7b-c2d3-04f5-7a8b9c0d1e2f', '30cfd8e1-5e7e-417d-9481-91a6fc8b9756', 'Sepatu SNTA 471', 'sepatu-snta-471', 'Sepatu gunung SNTA ukuran 42, nyaman dan cukup tahan air ringan.', 35000, 2, 'tersedia', '{"ukuran": "42", "bahan": "Suede", "waterproof": "Semi"}'),
('3d4e5f6a-7b8c-d3e4-1506-8b9c0d1e2f3a', 'c389d4ab-2a5a-4cb4-81d0-b749d68b92b6', 'Trekking Pole Antishock', 'trekking-pole-antishock', 'Trekking pole aluminium dengan sistem per (antishock) untuk meredam beban lutut.', 10000, 10, 'tersedia', '{"panjang_max": "135 cm", "bahan": "Alloy", "antishock": "Ya"}');
