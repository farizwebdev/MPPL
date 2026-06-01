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
    totalPieces?: number;
    totalCost: number;
    paymentStatus: string;
    laundryStatus: string;
    specialNotes: string | null;
    pickupDate: string | null;
    createdAt: string;
    customer: { name: string; noWa: string; alamat?: string };
    service: { name: string; pricePerKg: number };
    tallyDetails?: Record<string, number>;
    logs?: Array<{id: number; action: string; actor: string; role: string; timestamp: Date | string}>;
  };
}

export default function TransactionDetail({
  transaction,
}: TransactionDetailProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState(
    transaction.pickupDate
      ? new Date(transaction.pickupDate).toISOString().split("T")[0]
      : ""
  );

  const [origin, setOrigin] = useState("");
  const [notes, setNotes] = useState(transaction.specialNotes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    // Read role from cookie
    const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
    if (match) {
      setUserRole(match[2]);
    } else {
      setUserRole("karyawan");
    }

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
        body: JSON.stringify({ laundryStatus: newStatus, updatedBy: userRole === "owner" ? "Owner" : "Karyawan", updatedRole: userRole }),
      });
      router.refresh();
    } catch {
      alert("Gagal memperbarui status");
    } finally {
      setUpdating(false);
    }
  }

  async function togglePayment() {
    // Cycle between BELUM_LUNAS -> TUNAI -> QRIS -> BELUM_LUNAS
    const cycle = {
      "BELUM_LUNAS": "TUNAI",
      "TUNAI": "QRIS",
      "QRIS": "BELUM_LUNAS"
    };
    const newStatus = cycle[transaction.paymentStatus as keyof typeof cycle] || "TUNAI";
    setUpdating(true);
    try {
      await fetch(`/api/transactions/${transaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus, updatedBy: userRole === "owner" ? "Owner" : "Karyawan", updatedRole: userRole }),
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
        body: JSON.stringify({ pickupDate: pickupDate || null, updatedBy: userRole === "owner" ? "Owner" : "Karyawan", updatedRole: userRole }),
      });
      router.refresh();
    } catch {
      alert("Gagal menyimpan tanggal pengambilan");
    } finally {
      setUpdating(false);
    }
  }

  async function saveNotes() {
    setUpdating(true);
    try {
      await fetch(`/api/transactions/${transaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialNotes: notes || null, updatedBy: userRole === "owner" ? "Owner" : "Karyawan", updatedRole: userRole }),
      });
      setIsEditingNotes(false);
      router.refresh();
    } catch {
      alert("Gagal menyimpan catatan");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (confirm("Yakin ingin menghapus transaksi ini permanen?")) {
      setUpdating(true);
      try {
        await fetch(`/api/transactions/${transaction.id}`, { method: "DELETE" });
        router.push("/admin/transaksi");
      } catch {
        alert("Gagal menghapus transaksi");
        setUpdating(false);
      }
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
        className={`flex justify-between items-start transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div>
          <button
            onClick={() => router.push("/admin/transaksi")}
            className="group mb-3 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            <BackIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Kembali ke daftar
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Detail Transaksi
          </h1>
        </div>
        
        {userRole === "owner" && (
          <button
            onClick={handleDelete}
            disabled={updating}
            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
          >
            Hapus Transaksi
          </button>
        )}
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
          
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium ${
                transaction.paymentStatus !== "BELUM_LUNAS"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  transaction.paymentStatus !== "BELUM_LUNAS"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              />
              {transaction.paymentStatus === "BELUM_LUNAS" ? "BELUM LUNAS" : `LUNAS (${transaction.paymentStatus})`}
            </span>

            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

            <a
              href={`/cetak/${transaction.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cetak Nota
            </a>
            
            <a
              href={`https://wa.me/${transaction.customer.noWa.replace(/^0/, "62")}?text=${encodeURIComponent(`Halo *${transaction.customer.name}*,\n\nTerima kasih telah menggunakan jasa Ase Laundry.\n\nBerikut adalah resi digital Anda:\n📋 Resi: *${transaction.receiptCode}*\n💰 Total Biaya: ${formatRupiah(transaction.totalCost)}\n\nLacak status cucian Anda secara langsung di:\n${origin ? `${origin}/tracking?resi=${transaction.receiptCode}` : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-600"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M12 21a9 9 0 006.5-15.5 9 9 0 00-13 0A8.96 8.96 0 004.14 11.6L3 19l7.35-1.15A9 9 0 0012 21z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 10a1 1 0 00-1 1v1a3 3 0 003 3h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1a1 1 0 01-1-1v-1a1 1 0 00-1-1H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Kirim WA
            </a>
          </div>
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
            {transaction.customer.alamat && (
              <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                <span className="text-gray-500">Alamat</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">
                  {transaction.customer.alamat}
                </span>
              </div>
            )}
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
              <span className="text-gray-500">Kuantitas</span>
              <span className="font-medium text-gray-900">
                {transaction.totalWeight} kg {transaction.totalPieces ? `(${transaction.totalPieces} pcs)` : ''}
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
                transaction.paymentStatus !== "BELUM_LUNAS"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <MoneyIcon className="h-4 w-4" />
              {transaction.paymentStatus !== "BELUM_LUNAS"
                ? "Tandai Belum Lunas"
                : "Ubah Pembayaran"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Tally Details */}
      {transaction.tallyDetails && Object.keys(transaction.tallyDetails).length > 0 && (
        <div
          className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-500 delay-300 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
           <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Rincian Pakaian (Tally)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {Object.entries(transaction.tallyDetails).map(([item, count]) => {
                if (count > 0) {
                  return (
                    <div key={item} className="flex justify-between items-center rounded-lg bg-gray-50 px-3 py-2 border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                      <span className="text-sm font-bold text-blue-600">{count}</span>
                    </div>
                  );
                }
                return null;
             })}
          </div>
        </div>
      )}

      {/* Special Notes */}
      <div
        className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-500 delay-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "550ms" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M11 4H4v14a2 2 0 002 2h12a2 2 0 002-2V4h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Catatan Khusus
          </h3>
          {!isEditingNotes ? (
            <button onClick={() => setIsEditingNotes(true)} className="text-xs text-blue-600 hover:underline">Edit</button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => { setIsEditingNotes(false); setNotes(transaction.specialNotes || ""); }} className="text-xs text-gray-500 hover:underline">Batal</button>
              <button onClick={saveNotes} disabled={updating} className="text-xs font-semibold text-blue-600 hover:underline disabled:opacity-50">Simpan</button>
            </div>
          )}
        </div>
        {isEditingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-50 min-h-[80px]"
            placeholder="Tambahkan catatan khusus..."
          />
        ) : (
          <p className="text-sm leading-relaxed text-gray-600">
            {transaction.specialNotes || <span className="text-gray-400 italic">Tidak ada catatan khusus</span>}
          </p>
        )}
      </div>

      {/* Audit Trail (Log Aktivitas) */}
      {transaction.logs && transaction.logs.length > 0 && (
        <div
          className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all duration-500 delay-300 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Log Aktivitas (Audit Trail)
          </h3>
          <div className="relative border-l border-gray-200 ml-3 space-y-4 pb-2">
            {[...transaction.logs].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((log) => (
              <div key={log.id} className="relative pl-6">
                <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{log.action}</h4>
                  <time className="text-xs text-gray-500 mt-1 sm:mt-0">
                    {new Date(log.timestamp).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </time>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Oleh: {log.actor} ({log.role})</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
