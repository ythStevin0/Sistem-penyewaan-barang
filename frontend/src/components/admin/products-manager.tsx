"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Product, Category } from "@/types";
import type { ProductStatus } from "@/types";
import { upsertProduct, deleteProduct } from "@/app/actions/admin";
import { slugify } from "@/lib/utils/slug";
import { formatRupiah } from "@/lib/format/currency";

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
}

const emptyForm = {
  id: "",
  category_id: "",
  nama: "",
  slug: "",
  deskripsi: "",
  harga_sewa_per_hari: 0,
  stok: 1,
  status: "tersedia" as ProductStatus,
  gambar_urls: "",
  spesifikasi: "{}",
};

export function ProductsManager({ products, categories }: ProductsManagerProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? "" });
    setIsOpen(true);
    setError(null);
  };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id,
      category_id: p.category_id,
      nama: p.nama,
      slug: p.slug,
      deskripsi: p.deskripsi,
      harga_sewa_per_hari: p.harga_sewa_per_hari,
      stok: p.stok,
      status: p.status,
      gambar_urls: p.gambar_urls?.join(", ") ?? "",
      spesifikasi: JSON.stringify(p.spesifikasi ?? {}, null, 2),
    });
    setIsOpen(true);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const res = await upsertProduct({
      ...form,
      id: form.id || undefined,
    });
    if (!res.success) setError(res.error);
    else {
      setIsOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    setLoading(true);
    const res = await deleteProduct(id);
    if (!res.success) setError(res.error);
    else router.refresh();
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold text-forest-950">Produk</h1>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold"
        >
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forest-50/50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Nama</th>
              <th className="px-4 py-3 font-semibold">Harga/hari</th>
              <th className="px-4 py-3 font-semibold">Stok</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-forest-50/20">
                <td className="px-4 py-3 font-medium">{p.nama}</td>
                <td className="px-4 py-3">{formatRupiah(p.harga_sewa_per_hari)}</td>
                <td className="px-4 py-3">{p.stok}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEdit(p)} className="p-1.5 hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(p.id)}
                      className="p-1.5 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">{form.id ? "Edit" : "Tambah"} Produk</h2>
            <div className="space-y-3 text-sm">
              <input
                placeholder="Nama"
                value={form.nama}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nama: e.target.value,
                    slug: f.id ? f.slug : slugify(e.target.value),
                  }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Deskripsi"
                value={form.deskripsi}
                onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Harga/hari"
                  value={form.harga_sewa_per_hari}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, harga_sewa_per_hari: Number(e.target.value) }))
                  }
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Stok"
                  value={form.stok}
                  onChange={(e) => setForm((f) => ({ ...f, stok: Number(e.target.value) }))}
                  className="border rounded-lg px-3 py-2"
                />
              </div>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProductStatus }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="tersedia">Tersedia</option>
                <option value="disewa">Disewa</option>
                <option value="rusak">Rusak</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <input
                placeholder="URL gambar (pisah koma)"
                value={form.gambar_urls}
                onChange={(e) => setForm((f) => ({ ...f, gambar_urls: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
              <textarea
                placeholder='Spesifikasi JSON, contoh: {"berat":"2kg"}'
                value={form.spesifikasi}
                onChange={(e) => setForm((f) => ({ ...f, spesifikasi: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 h-24 font-mono text-xs"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-bold disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
