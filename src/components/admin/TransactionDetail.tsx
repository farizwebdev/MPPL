"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import StatusStepper from "./StatusStepper";
import { formatRupiah } from "@/lib/utils";
import {
  ReceiptIcon,
  CustomerIcon,
  MoneyIcon,
  CalendarIcon,
  SaveIcon,
  BackIcon,
} from "./AdminIcons";

interface TransactionDetailProps {
  transaction: {
    id: string;
    receiptCode: string;
    totalWeight: number;
    totalCost: number;
    paymentStatus: string;
    laundryStatus: string;
    specialNotes: string | null;
    pickupDate: string | null;
    createdAt: string;
    customer: { name: string; noWa: string };
    service: { name: string; pricePerKg: number };
  };
}

export default function TransactionDetail({
  transaction,
}: TransactionDetailProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [pickupDate, setPickupDate] = useState(
    transaction.pickupDate
      ? new Date(transaction.pickupDate).toISOString().split("T")[0]
      : ""
  );

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

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    try {
      await fetch(`/api/transactions/${transaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ laundryStatus: newStatus }),
      });
      router.refresh();
    } catch {
      alert("Gagal memperbarui status");
    } finally {
      setUpdating(false);
    }
  }

  async function togglePayment() {
    const newStatus =
      transaction.paymentStatus === "LUNAS" ? "BELUM_LUNAS" : "LUNAS";
    setUpdating(true);
    try {
      await fetch(`/api/transactions/${transaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      router.refresh();
    } catch {
      alert("Gagal memperbarui pembayaran");
    } finally {
      setUpdating(false);
    }
  }

  async function savePickupDate() {
    setUpdating(true);
    try {
      await fetch(`/api/transactions/${transaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupDate: pickupDate || null }),
      });
      router.refresh();
    } catch {
      alert("Gagal menyimpan tanggal pengambilan");
    } finally {
      setUpdating(false);
    }
  }

  const createdAt = new Date(transaction.createdAt);
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  const isOldItem = createdAt < twoYearsAgo;

  return (
    <div ref={sectionRef} className="space-y-6">
      {/* Header */}
      <div
        className={`transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <button
          onClick={() => router.push("/transaksi")}
          className="group mb-3 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <BackIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke daftar
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Detail Transaksi
        </h1>
      </div>

      {/* Old item warning */}
      {isOldItem && (
        <div
          className={`rounded-2xl border border-yellow-200 bg-yellow-50 p-4 transition-all duration-500 delay-75 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4M12 16v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Barang ini sudah lebih dari 2 tahun
              </p>
              <p className="mt-0.5 text-xs text-yellow-600">
                Status berubah menjadi &quot;Disumbangkan&quot;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resi + Payment Status */}
      <div
        className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-500 delay-100 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "150ms" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ReceiptIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Kode Resi
              </p>
              <p className="text-2xl font-bold tracking-wider text-gray-900">
                {transaction.receiptCode}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium ${
              transaction.paymentStatus === "LUNAS"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                transaction.paymentStatus === "LUNAS"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            />
            {transaction.paymentStatus === "LUNAS" ? "LUNAS" : "BELUM LUNAS"}
          </span>
        </div>
      </div>

      {/* Status Pengerjaan */}
      <div
        className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-500 delay-150 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "250ms" }}
      >
        <h3 className="mb-5 flex items-center gap-2 font-semibold text-gray-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </span>
          Status Pengerjaan
        </h3>
        <StatusStepper
          currentStatus={transaction.laundryStatus}
          onUpdate={updateStatus}
        />
      </div>

      {/* Customer & Order Info */}
      <div
        className={`grid gap-5 sm:grid-cols-2 transition-all duration-500 delay-200 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "350ms" }}
      >
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <CustomerIcon className="h-3.5 w-3.5" />
            </div>
            Info Pelanggan
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-2.5">
              <span className="text-gray-500">Nama</span>
              <span className="font-medium text-gray-900">
                {transaction.customer.name}
              </span>
            </div>
            <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-2.5">
              <span className="text-gray-500">No. WA</span>
              <span className="font-medium text-gray-900">
                {transaction.customer.noWa}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <ReceiptIcon className="h-3.5 w-3.5" />
            </div>
            Detail Pesanan
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-2.5">
              <span className="text-gray-500">Layanan</span>
              <span className="font-medium text-gray-900">
                {transaction.service.name}
              </span>
            </div>
            <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-2.5">
              <span className="text-gray-500">Berat</span>
              <span className="font-medium text-gray-900">
                {transaction.totalWeight} kg
              </span>
            </div>
            <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-2.5">
              <span className="text-gray-500">Total Biaya</span>
              <span className="font-semibold text-blue-700">
                {formatRupiah(transaction.totalCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup & Payment */}
      <div
        className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-500 delay-250 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "450ms" }}
      >
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <CalendarIcon className="h-3.5 w-3.5" />
          </div>
          Pengambilan & Pembayaran
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Pengambilan
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-xs transition-all duration-200 hover:border-gray-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50 focus:outline-none"
              />
              <button
                onClick={savePickupDate}
                disabled={updating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-50"
              >
                <SaveIcon className="h-3.5 w-3.5" />
                Simpan
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <button
              onClick={togglePayment}
              disabled={updating}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:shadow-md disabled:opacity-50 ${
                transaction.paymentStatus === "LUNAS"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <MoneyIcon className="h-4 w-4" />
              {transaction.paymentStatus === "LUNAS"
                ? "Tandai Belum Lunas"
                : "Tandai Lunas"}
            </button>
          </div>
        </div>
      </div>

      {/* Special Notes */}
      {transaction.specialNotes && (
        <div
          className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-500 delay-300 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "550ms" }}
        >
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M11 4H4v14a2 2 0 002 2h12a2 2 0 002-2V4h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Catatan Khusus
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            {transaction.specialNotes}
          </p>
        </div>
      )}
    </div>
  );
}
