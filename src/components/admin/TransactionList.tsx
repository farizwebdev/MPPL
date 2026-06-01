"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { SearchIcon, FilterIcon, PlusIcon, ReceiptIcon } from "./AdminIcons";
import TransactionBoard from "./TransactionBoard";

interface Customer {
  name: string;
  noWa: string;
}

interface Service {
  name: string;
}

interface Transaction {
  id: string;
  receiptCode: string;
  totalWeight: number;
  totalCost: number;
  paymentStatus: string;
  laundryStatus: string;
  customer: Customer;
  service: Service;
}

const statusColors: Record<string, string> = {
  ANTREAN: "bg-gray-100 text-gray-600",
  DICUCI: "bg-blue-100 text-blue-700",
  DISETRIKA: "bg-purple-100 text-purple-700",
  SIAP_DIAMBIL: "bg-green-100 text-green-700",
  SELESAI: "bg-teal-100 text-teal-700",
  DISUMBANGKAN: "bg-yellow-100 text-yellow-700",
};

const statusLabels: Record<string, string> = {
  ANTREAN: "Antrean",
  DICUCI: "Dicuci",
  DISETRIKA: "Disetrika",
  SIAP_DIAMBIL: "Siap Diambil",
  SELESAI: "Selesai",
  DISUMBANGKAN: "Disumbangkan",
};

const statusOptions = [
  { value: "", label: "Semua Status" },
  ...Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
];

function TransactionCard({ t }: { t: Transaction }) {
  return (
    <Link
      href={`/admin/transaksi/${t.id}`}
      className="block rounded-xl border border-gray-100 bg-white p-4 shadow-xs transition-all hover:border-gray-200 hover:shadow-sm active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-blue-600 truncate">{t.receiptCode}</p>
          <p className="mt-0.5 text-sm font-medium text-gray-800 truncate">
            {t.customer.name}
          </p>
          <p className="text-xs text-gray-400 truncate">{t.customer.noWa}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              statusColors[t.laundryStatus] || "bg-gray-100 text-gray-600"
            }`}
          >
            {statusLabels[t.laundryStatus] || t.laundryStatus}
          </span>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              t.paymentStatus === "LUNAS"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {t.paymentStatus === "LUNAS" ? "Lunas" : "Belum Lunas"}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-sm">
        <span className="text-gray-500">{t.service.name}</span>
        <span className="font-medium text-gray-800">
          {t.totalWeight} kg &middot; {formatRupiah(t.totalCost)}
        </span>
      </div>
    </Link>
  );
}

export default function TransactionList({
  transactions: initialData,
}: {
  transactions: Transaction[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(initialData);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
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
  }, []);

  const filtered = useMemo(() => {
    return data.filter((t) => {
      const matchSearch =
        !search ||
        t.receiptCode.toLowerCase().includes(search.toLowerCase()) ||
        t.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        t.customer.noWa.includes(search);

      const matchStatus = !statusFilter || t.laundryStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  async function handleUpdate(id: string, updates: any) {
    // Optimistic UI update
    setData((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    
    // Read role
    let role = "karyawan";
    if (typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
      if (match) role = match[2];
    }
    
    try {
      await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, updatedBy: role === "owner" ? "Owner" : "Karyawan", updatedRole: role }),
      });
    } catch {
      // Revert if error
      setData(initialData);
    }
  }

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <div
        className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Daftar Transaksi
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola semua transaksi laundry
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === "board"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Papan
            </button>
          </div>
          <Link
            href="/admin/transaksi/baru"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Transaksi Baru</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div
        className={`mb-5 flex flex-col gap-3 sm:flex-row sm:items-center transition-all duration-500 delay-75 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "150ms" }}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari resi, nama, atau no. WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-xs transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:outline-none"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <FilterIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 shadow-xs transition-all duration-200 hover:border-gray-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Mobile Card View (hidden on md+) */}
      {viewMode === "list" && (
        <div
          className={`space-y-3 md:hidden transition-all duration-500 delay-100 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "250ms" }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white py-16">
            <SearchIcon className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-400">
              {search || statusFilter
                ? "Tidak ada transaksi yang cocok"
                : "Belum ada transaksi"}
            </p>
          </div>
        ) : (
          filtered.map((t, i) => (
            <div
              key={t.id}
              style={{
                animation: visible
                  ? `fadeUp 0.4s ease-out ${i * 50}ms forwards`
                  : "none",
                opacity: 0,
              }}
            >
              <TransactionCard t={t} />
            </div>
          ))
        )}
        {filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 pt-2">
            Menampilkan {filtered.length} dari {data.length} transaksi
          </p>
        )}
      </div>
      )}

      {/* Desktop Table (hidden on mobile) */}
      {viewMode === "list" && (
        <div
          className={`hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-500 delay-100 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "250ms" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Resi
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Pelanggan
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Layanan
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
                  Pembayaran
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <SearchIcon className="h-8 w-8 text-gray-300" />
                      <p className="text-sm text-gray-400">
                        {search || statusFilter
                          ? "Tidak ada transaksi yang cocok"
                          : "Belum ada transaksi"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
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
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/transaksi/${t.id}`}
                        className="font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        {t.receiptCode}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">
                        {t.customer.name}
                      </p>
                      <p className="text-xs text-gray-400">{t.customer.noWa}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {t.service.name}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {t.totalWeight} kg
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {formatRupiah(t.totalCost)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          statusColors[t.laundryStatus] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabels[t.laundryStatus] || t.laundryStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          t.paymentStatus === "LUNAS"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.paymentStatus === "LUNAS" ? "Lunas" : "Belum Lunas"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-400">
              Menampilkan {filtered.length} dari {data.length} transaksi
            </p>
          </div>
        )}
      </div>
      )}

      {/* Kanban Board View */}
      {viewMode === "board" && (
        <div
          className={`transition-all duration-500 delay-100 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "250ms" }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center mt-4">
              <SearchIcon className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-400">
                Tidak ada transaksi
              </p>
            </div>
          ) : (
            <TransactionBoard transactions={filtered} onUpdate={handleUpdate} />
          )}
        </div>
      )}
    </div>
  );
}
