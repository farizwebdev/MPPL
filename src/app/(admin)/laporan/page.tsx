"use client";

import { useState, useEffect, useRef } from "react";
import { formatRupiah } from "@/lib/utils";
import {
  ReceiptIcon,
  MoneyIcon,
  WeightIcon,
  CalendarIcon,
  RefreshIcon,
  CheckIcon,
} from "@/components/admin/AdminIcons";

interface Transaction {
  id: string;
  receiptCode: string;
  totalWeight: number;
  totalCost: number;
  paymentStatus: string;
  laundryStatus: string;
  createdAt: string;
  customer: { name: string };
  service: { name: string };
}

interface ReportData {
  totalRevenue: number;
  totalWeight: number;
  totalTransactions: number;
  paidCount: number;
  unpaidCount: number;
  transactions: Transaction[];
}

const statusLabels: Record<string, string> = {
  ANTREAN: "Antrean",
  DICUCI: "Dicuci",
  DISETRIKA: "Disetrika",
  SIAP_DIAMBIL: "Siap Diambil",
  SELESAI: "Selesai",
  DISUMBANGKAN: "Disumbangkan",
};

export default function LaporanPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();

    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchReport() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/reports?start=${startDate}&end=${endDate}`
      );
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <div
        className={`mb-6 transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Laporan Setoran
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Lihat ringkasan pendapatan dan transaksi
        </p>
      </div>

      {/* Date Filter */}
      <div
        className={`mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all duration-500 delay-75 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "100ms" }}
      >
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dari Tanggal
            </label>
            <div className="relative mt-1.5">
              <CalendarIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-xs transition-all duration-200 hover:border-gray-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sampai Tanggal
            </label>
            <div className="relative mt-1.5">
              <CalendarIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-xs transition-all duration-200 hover:border-gray-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-50"
          >
            <RefreshIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Memuat..." : "Tampilkan"}
          </button>
        </div>
      </div>

      {data && (
        <>
          {/* Stat Cards */}
          <div
            className={`mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500 delay-150 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-gray-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Transaksi</p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900">
                    {data.totalTransactions}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <ReceiptIcon className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-gray-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Pendapatan</p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900">
                    {formatRupiah(data.totalRevenue)}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white">
                  <MoneyIcon className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-gray-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Berat</p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900">
                    {data.totalWeight} kg
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white">
                  <WeightIcon className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-gray-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pembayaran</p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900">
                    {data.paidCount}{" "}
                    <span className="text-sm font-normal text-gray-400">
                      / {data.unpaidCount}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Lunas / Belum
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 transition-all duration-300 group-hover:bg-yellow-600 group-hover:text-white">
                  <CheckIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Card View (hidden on md+) */}
          <div
            className={`space-y-3 md:hidden transition-all duration-500 delay-200 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {data.transactions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white py-16">
                <ReceiptIcon className="h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-400">
                  Tidak ada transaksi di periode ini
                </p>
              </div>
            ) : (
              data.transactions.map((t, i) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-xs"
                  style={{
                    animation: visible
                      ? `fadeUp 0.4s ease-out ${i * 50}ms forwards`
                      : "none",
                    opacity: 0,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-blue-600 truncate">{t.receiptCode}</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800 truncate">
                        {t.customer.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(t.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-gray-600 text-xs">{t.laundryStatus ? (statusLabels[t.laundryStatus] || t.laundryStatus) : ""}</span>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          t.paymentStatus === "LUNAS"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.paymentStatus === "LUNAS" ? "Lunas" : "Blm Lunas"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-sm">
                    <span className="text-gray-500">{t.totalWeight} kg</span>
                    <span className="font-medium text-gray-800">
                      {formatRupiah(t.totalCost)}
                    </span>
                  </div>
                </div>
              ))
            )}
            {data.transactions.length > 0 && (
              <p className="text-center text-xs text-gray-400 pt-2">
                Menampilkan {data.transactions.length} transaksi
              </p>
            )}
          </div>

          {/* Desktop Table (hidden on mobile) */}
          <div
            className={`hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-500 delay-200 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Tanggal
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Resi
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Pelanggan
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Berat
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Biaya
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Bayar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <ReceiptIcon className="h-8 w-8 text-gray-300" />
                          <p className="text-sm text-gray-400">
                            Tidak ada transaksi di periode ini
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.transactions.map((t, i) => (
                      <tr
                        key={t.id}
                        className="group transition-all duration-200 hover:bg-blue-50/30"
                        style={{
                          animation: visible
                            ? `fadeUp 0.4s ease-out ${i * 30}ms forwards`
                            : "none",
                          opacity: 0,
                        }}
                      >
                        <td className="px-5 py-3.5 text-gray-600">
                          {new Date(t.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-blue-600">
                          {t.receiptCode}
                        </td>
                        <td className="px-5 py-3.5 text-gray-800">
                          {t.customer.name}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {t.totalWeight} kg
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-800">
                          {formatRupiah(t.totalCost)}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {statusLabels[t.laundryStatus] || t.laundryStatus}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              t.paymentStatus === "LUNAS"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {t.paymentStatus === "LUNAS" ? "Lunas" : "Blm Lunas"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {data.transactions.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-3">
                <p className="text-xs text-gray-400">
                  Menampilkan {data.transactions.length} transaksi
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
