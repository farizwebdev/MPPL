"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatRupiah } from "@/lib/utils";

const stepKeys = ["ANTREAN", "DICUCI", "DISETRIKA", "SIAP_DIAMBIL", "SELESAI"];
const stepLabels = ["Antrean", "Dicuci", "Disetrika", "Siap Diambil", "Selesai"];

interface Transaction {
  id: string;
  receiptCode: string;
  totalWeight: number;
  totalPieces?: number;
  totalCost: number;
  paymentStatus: string;
  laundryStatus: string;
  specialNotes: string | null;
  createdAt: string;
  customer: { name: string; noWa: string };
  service: { name: string; pricePerKg: number; estimatedTime: string };
}

export default function TrackingContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resi = searchParams.get("resi");
    if (resi) {
      setQuery(resi);
      handleSearch(resi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleSearch(q?: string) {
    const term = q || query;
    if (!term.trim()) {
      setError("Masukkan nomor resi atau nomor HP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isPhone = /^[0-9]+$/.test(term.replace(/[\s\-]/g, ""));
      const param = isPhone ? `phone=${encodeURIComponent(term)}` : `resi=${encodeURIComponent(term)}`;
      const res = await fetch(`/api/tracking?${param}`);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Transaksi tidak ditemukan");
        setTransactions(null);
        return;
      }

      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : [data]);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setTransactions(null);
    } finally {
      setLoading(false);
    }
  }

  function getWhatsAppLink(transaction: Transaction) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const trackingLink = `${baseUrl}/tracking?resi=${transaction.receiptCode}`;
    const message = `Halo *${transaction.customer.name}*,\n\nStatus cucian Anda:\n📋 Resi: *${transaction.receiptCode}*\n📌 Status: *${stepLabels[stepKeys.indexOf(transaction.laundryStatus)] || transaction.laundryStatus}*\n💰 Biaya: ${formatRupiah(transaction.totalCost)}\n\nLacak langsung: ${trackingLink}`;
    return `https://wa.me/${transaction.customer.noWa.replace(/^0/, "62")}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="pt-8 text-center flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg mb-2">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
              <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-blue-600">WashTrack</h1>
          <p className="text-gray-500">Lacak status cucian Anda secara real-time</p>
        </div>

        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Masukkan nomor resi atau No. HP"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Cari"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {transactions && transactions.length > 0 && (
          <div className="mt-6 space-y-4">
            {transactions.map((t) => {
              const currentIdx = stepKeys.indexOf(t.laundryStatus);
              return (
                <div
                  key={t.id}
                  className="rounded-2xl border bg-white p-6 shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Kode Resi</p>
                      <p className="text-lg font-bold tracking-wider text-blue-700">
                        {t.receiptCode}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        t.paymentStatus === "LUNAS"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.paymentStatus === "LUNAS" ? "LUNAS" : "BELUM LUNAS"}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      {stepLabels.map((label, i) => (
                        <div key={label} className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                              i <= currentIdx
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <p
                            className={`mt-1 text-[10px] ${
                              i <= currentIdx
                                ? "font-medium text-blue-700"
                                : "text-gray-400"
                            }`}
                          >
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${((currentIdx + 1) / stepKeys.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 text-sm">
                    <div>
                      <p className="text-gray-400">Pelanggan</p>
                      <p className="font-medium text-gray-800">{t.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Layanan</p>
                      <p className="font-medium text-gray-800">{t.service.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Berat</p>
                      <p className="font-medium text-gray-800">{t.totalWeight} kg</p>
                    </div>
                    {t.totalPieces && (
                      <div>
                        <p className="text-gray-400">Total Potong</p>
                        <p className="font-medium text-gray-800">{t.totalPieces} pcs</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400">Biaya</p>
                      <p className="font-medium text-gray-800">
                        {formatRupiah(t.totalCost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Estimasi</p>
                      <p className="font-medium text-gray-800">
                        {t.service.estimatedTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="font-medium text-blue-700">
                        {stepLabels[currentIdx] || t.laundryStatus}
                      </p>
                    </div>
                  </div>

                  {t.specialNotes && (
                    <div className="mt-3 rounded-xl bg-yellow-50 p-3 text-sm">
                      <p className="text-gray-400">Catatan:</p>
                      <p className="text-gray-700">{t.specialNotes}</p>
                    </div>
                  )}

                  <a
                    href={getWhatsAppLink(t)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-600"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                      <path d="M12 21a9 9 0 006.5-15.5 9 9 0 00-13 0A8.96 8.96 0 004.14 11.6L3 19l7.35-1.15A9 9 0 0012 21z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 10a1 1 0 00-1 1v1a3 3 0 003 3h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1a1 1 0 01-1-1v-1a1 1 0 00-1-1H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Bagikan via WhatsApp
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
