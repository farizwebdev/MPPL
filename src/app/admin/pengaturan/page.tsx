"use client";

import { useState, useEffect, useRef } from "react";
import { formatRupiah } from "@/lib/utils";
import Input from "@/components/ui/Input";
import { SettingsIcon, PlusIcon, SaveIcon } from "@/components/admin/AdminIcons";

interface Service {
  id: string;
  name: string;
  pricePerKg: number;
  estimatedTime: string;
}

export default function PengaturanPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", pricePerKg: "", estimatedTime: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
    
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(svc: Service) {
    setEditingId(svc.id);
    setForm({ name: svc.name, pricePerKg: svc.pricePerKg.toString(), estimatedTime: svc.estimatedTime });
    setIsModalOpen(true);
  }

  function handleAddNew() {
    setEditingId(null);
    setForm({ name: "", pricePerKg: "", estimatedTime: "" });
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus layanan ini?")) return;
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      fetchServices();
    } catch {
      alert("Gagal menghapus");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      pricePerKg: parseInt(form.pricePerKg) || 0,
      estimatedTime: form.estimatedTime
    };

    try {
      if (editingId) {
        await fetch(`/api/services/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchServices();
    } catch {
      alert("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={sectionRef}>
      <div className={`mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Pengaturan Layanan</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola katalog layanan, harga, dan estimasi pengerjaan</p>
        </div>
        <button onClick={handleAddNew} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700">
          <PlusIcon className="h-4 w-4" /> Tambah Layanan
        </button>
      </div>

      <div className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-500 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">Nama Layanan</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">Harga / Satuan</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">Estimasi</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{svc.name}</td>
                    <td className="px-5 py-4 font-semibold text-blue-600">{formatRupiah(svc.pricePerKg)}</td>
                    <td className="px-5 py-4 text-gray-600">{svc.estimatedTime}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleEdit(svc)} className="text-blue-600 hover:underline text-xs mr-3 font-medium">Edit</button>
                      <button onClick={() => handleDelete(svc.id)} className="text-red-500 hover:underline text-xs font-medium">Hapus</button>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-500">Tidak ada data layanan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-900">{editingId ? "Edit Layanan" : "Layanan Baru"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input id="name" label="Nama Layanan" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <Input id="price" label="Harga per Kg/Pcs (Rp)" type="number" min="0" value={form.pricePerKg} onChange={(e) => setForm({...form, pricePerKg: e.target.value})} required />
              <Input id="time" label="Estimasi Waktu" placeholder="Misal: 2 hari" value={form.estimatedTime} onChange={(e) => setForm({...form, estimatedTime: e.target.value})} required />
              
              <div className="pt-4 mt-6 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl">Batal</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  <SaveIcon className="h-4 w-4" /> {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
