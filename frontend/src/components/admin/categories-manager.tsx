"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Category } from "@/types";
import { upsertCategory, deleteCategory } from "@/app/actions/admin";
import { slugify } from "@/lib/utils/slug";

interface CategoriesManagerProps {
  categories: Category[];
}

const emptyForm = { id: "", nama: "", slug: "", deskripsi: "", icon: "" };

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setForm(emptyForm);
    setIsOpen(true);
    setError(null);
  };

  const openEdit = (c: Category) => {
    setForm({
      id: c.id,
      nama: c.nama,
      slug: c.slug,
      deskripsi: c.deskripsi ?? "",
      icon: c.icon ?? "",
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await upsertCategory({ ...form, id: form.id || undefined });
    if (!res.success) setError(res.error);
    else {
      setIsOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori?")) return;
    setLoading(true);
    const res = await deleteCategory(id);
    if (!res.success) setError(res.error);
    else router.refresh();
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold text-forest-950">Kategori</h1>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold"
        >
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="grid gap-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-border p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{c.nama}</p>
              <p className="text-xs text-muted-foreground">/{c.slug}</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => openEdit(c)} className="p-2 hover:text-primary">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(c.id)}
                className="p-2 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl border p-6 w-full max-w-md">
            <h2 className="font-bold mb-4">{form.id ? "Edit" : "Tambah"} Kategori</h2>
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
              <input
                placeholder="Icon (opsional)"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Deskripsi"
                value={form.deskripsi}
                onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-bold"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Simpan"}
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
