"use client";

import { useRouter } from "next/navigation";
import StatusStepper from "./StatusStepper";
import { formatRupiah } from "@/lib/utils";
import { useState } from "react";

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
  const [updating, setUpdating] = useState(false);
  const [pickupDate, setPickupDate] = useState(
    transaction.pickupDate
      ? new Date(transaction.pickupDate).toISOString().split("T")[0]
      : ""
  );

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
    <div className="space-y-6">
      {isOldItem && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-800">
            ⚠️ Barang ini sudah lebih dari 2 tahun — status berubah menjadi &quot;Disumbangkan&quot;
          </p>
        </div>
      )}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Kode Resi</p>
            <p className="text-2xl font-bold tracking-wider text-blue-700">
              {transaction.receiptCode}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              transaction.paymentStatus === "LUNAS"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {transaction.paymentStatus === "LUNAS" ? "LUNAS" : "BELUM LUNAS"}
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-700">Status Pengerjaan</h3>
        <StatusStepper
          currentStatus={transaction.laundryStatus}
          onUpdate={updateStatus}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold text-gray-700">Info Pelanggan</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Nama:</span>{" "}
              {transaction.customer.name}
            </p>
            <p>
              <span className="text-gray-500">No. WA:</span>{" "}
              {transaction.customer.noWa}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold text-gray-700">Detail Pesanan</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Layanan:</span>{" "}
              {transaction.service.name}
            </p>
            <p>
              <span className="text-gray-500">Berat:</span>{" "}
              {transaction.totalWeight} kg
            </p>
            <p>
              <span className="text-gray-500">Total Biaya:</span>{" "}
              {formatRupiah(transaction.totalCost)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-gray-700">Pengambilan</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Pengambilan
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={savePickupDate}
            disabled={updating}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Simpan
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={togglePayment}
            disabled={updating}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              transaction.paymentStatus === "LUNAS"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Tandai {transaction.paymentStatus === "LUNAS" ? "Belum Lunas" : "Lunas"}
          </button>
        </div>
      </div>

      {transaction.specialNotes && (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="mb-2 font-semibold text-gray-700">Catatan Khusus</h3>
          <p className="text-sm text-gray-600">{transaction.specialNotes}</p>
        </div>
      )}
    </div>
  );
}
