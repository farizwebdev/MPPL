"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { formatRupiah } from "@/lib/utils";

export default function ShiftPage() {
  const [totalSystem, setTotalSystem] = useState<number>(0);
  const [physicalCash, setPhysicalCash] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch total tunai
    fetch("/api/shift")
      .then((res) => res.json())
      .then((data) => {
        setTotalSystem(data.totalTunai || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const physicalNum = parseFloat(physicalCash || "0");
  const difference = physicalNum - totalSystem;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API request to close shift
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 1000);
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data kas...</div>;
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg mt-8 rounded-2xl border border-green-100 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
           <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
             <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900">Shift Ditutup!</h2>
        <p className="mt-2 text-sm text-gray-500">
          Laporan penutupan kasir berhasil disimpan dan dikirim ke Owner.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setPhysicalCash("");
            setNotes("");
          }}
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700"
        >
          Tutup
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tutup Kasir</h1>
        <p className="mt-1 text-sm text-gray-500">
          Lakukan rekonsiliasi kas (Tally Harian) sebelum mengakhiri shift Anda.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl bg-blue-50/50 p-5 border border-blue-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Pemasukan Tunai (Sistem)</h3>
            <p className="text-3xl font-bold text-blue-700">{formatRupiah(totalSystem)}</p>
          </div>

          <div className="space-y-4">
            <Input
              id="physicalCash"
              label="Total Uang Fisik (Rp)"
              type="number"
              placeholder="Masukkan jumlah uang fisik di laci kasir"
              value={physicalCash}
              onChange={(e) => setPhysicalCash(e.target.value)}
            />

            {physicalCash !== "" && (
              <div className={`rounded-xl p-4 border ${difference === 0 ? "bg-green-50 border-green-100" : difference < 0 ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${difference === 0 ? "text-green-700" : difference < 0 ? "text-red-700" : "text-yellow-700"}`}>
                    {difference === 0 ? "Sesuai (Balance)" : difference < 0 ? "Selisih Kurang (Minus)" : "Selisih Lebih (Plus)"}
                  </span>
                  <span className={`font-bold ${difference === 0 ? "text-green-700" : difference < 0 ? "text-red-700" : "text-yellow-700"}`}>
                    {difference === 0 ? "Rp 0" : formatRupiah(Math.abs(difference))}
                  </span>
                </div>
              </div>
            )}

            <TextArea
              id="notes"
              label="Catatan Shift (Wajib jika ada selisih)"
              placeholder="Contoh: Selisih kurang karena uang kembalian tidak pas, dll."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || (difference !== 0 && notes.trim() === "") || physicalCash === ""}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Memproses..." : "Tutup Kasir & Simpan Laporan"}
          </button>
        </form>
      </div>
    </div>
  );
}
