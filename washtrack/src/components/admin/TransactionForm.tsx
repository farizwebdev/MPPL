"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import { formatRupiah } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  pricePerKg: number;
  estimatedTime: string;
}

interface FormData {
  customerName: string;
  noWa: string;
  serviceId: string;
  totalWeight: string;
  specialNotes: string;
}

interface FormErrors {
  customerName?: string;
  noWa?: string;
  serviceId?: string;
  totalWeight?: string;
}

export default function TransactionForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<FormData>({
    customerName: "",
    noWa: "",
    serviceId: "",
    totalWeight: "",
    specialNotes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    receiptCode: string;
    totalCost: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices)
      .catch(console.error);
  }, []);

  const selectedService = services.find((s) => s.id === form.serviceId);
  const weight = parseFloat(form.totalWeight) || 0;
  const estimatedCost = selectedService ? weight * selectedService.pricePerKg : 0;

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.customerName.trim()) errs.customerName = "Nama pelanggan wajib diisi";
    if (!form.noWa.trim()) errs.noWa = "Nomor WhatsApp wajib diisi";
    if (!form.serviceId) errs.serviceId = "Pilih jenis layanan";
    if (!form.totalWeight || parseFloat(form.totalWeight) < 2)
      errs.totalWeight = "Berat minimal 2 kg";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          noWa: form.noWa,
          serviceId: form.serviceId,
          totalWeight: weight,
          specialNotes: form.specialNotes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Gagal menyimpan transaksi");
        return;
      }

      const data = await res.json();
      setResult({ receiptCode: data.receiptCode, totalCost: data.totalCost });
      setForm({
        customerName: "",
        noWa: "",
        serviceId: "",
        totalWeight: "",
        specialNotes: "",
      });
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-md rounded-xl border bg-white p-8 text-center shadow-lg">
        <span className="text-5xl">✅</span>
        <h2 className="mt-4 text-xl font-bold text-gray-800">
          Transaksi Berhasil!
        </h2>
        <div className="mt-6 space-y-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-gray-500">Kode Resi</p>
            <p className="text-2xl font-bold tracking-wider text-blue-700">
              {result.receiptCode}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-gray-500">Total Biaya</p>
            <p className="text-xl font-bold text-green-700">
              {formatRupiah(result.totalCost)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setResult(null)}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Buat Transaksi Baru
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5">
      <Input
        id="customerName"
        label="Nama Pelanggan"
        placeholder="Masukkan nama pelanggan"
        value={form.customerName}
        onChange={(e) =>
          setForm({ ...form, customerName: e.target.value })
        }
        error={errors.customerName}
      />

      <Input
        id="noWa"
        label="Nomor WhatsApp"
        placeholder="0812xxxxxx"
        value={form.noWa}
        onChange={(e) => setForm({ ...form, noWa: e.target.value })}
        error={errors.noWa}
      />

      <Select
        id="serviceId"
        label="Jenis Layanan"
        options={services.map((s) => ({
          value: s.id,
          label: `${s.name} — ${formatRupiah(s.pricePerKg)}/kg (${s.estimatedTime})`,
        }))}
        value={form.serviceId}
        onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
        error={errors.serviceId}
      />

      <Input
        id="totalWeight"
        label="Berat (kg)"
        type="number"
        step="0.5"
        min="2"
        placeholder="Minimal 2 kg"
        value={form.totalWeight}
        onChange={(e) =>
          setForm({ ...form, totalWeight: e.target.value })
        }
        error={errors.totalWeight}
      />

      {selectedService && weight >= 2 && (
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {weight} kg × {formatRupiah(selectedService.pricePerKg)}
            </span>
            <span className="font-semibold text-blue-700">
              = {formatRupiah(estimatedCost)}
            </span>
          </div>
        </div>
      )}

      <TextArea
        id="specialNotes"
        label="Catatan Khusus (opsional)"
        placeholder="Contoh: Baju luntur, Kaus kaki kurang 1, Ada noda tinta"
        value={form.specialNotes}
        onChange={(e) =>
          setForm({ ...form, specialNotes: e.target.value })
        }
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Menyimpan..." : "Simpan Transaksi"}
      </button>
    </form>
  );
}
