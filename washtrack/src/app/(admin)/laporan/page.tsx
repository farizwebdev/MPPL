"use client";

import { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";

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

export default function LaporanPage() {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
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
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Laporan Setoran</h1>

      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Memuat..." : "Tampilkan"}
        </button>
      </div>

      {data && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Transaksi</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {data.totalTransactions}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Pendapatan</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {formatRupiah(data.totalRevenue)}
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Berat</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                {data.totalWeight} kg
              </p>
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Pembayaran</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {data.paidCount} Lunas / {data.unpaidCount} Belum
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Tanggal</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Resi</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Pelanggan</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Berat</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Biaya</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      Tidak ada transaksi di periode ini
                    </td>
                  </tr>
                ) : (
                  data.transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(t.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-600">
                        {t.receiptCode}
                      </td>
                      <td className="px-4 py-3 text-gray-800">{t.customer.name}</td>
                      <td className="px-4 py-3 text-gray-600">{t.totalWeight} kg</td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {formatRupiah(t.totalCost)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {t.laundryStatus === "ANTREAN" && "Antrean"}
                        {t.laundryStatus === "DICUCI" && "Dicuci"}
                        {t.laundryStatus === "DISETRIKA" && "Disetrika"}
                        {t.laundryStatus === "SIAP_DIAMBIL" && "Siap Diambil"}
                        {t.laundryStatus === "SELESAI" && "Selesai"}
                        {t.laundryStatus === "DISUMBANGKAN" && "Disumbangkan"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
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
        </>
      )}
    </div>
  );
}
