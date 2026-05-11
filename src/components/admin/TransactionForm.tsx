"use client";

import { useState, useEffect, useRef } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import { formatRupiah } from "@/lib/utils";
import { SaveIcon, ReceiptIcon, MoneyIcon, CheckIcon } from "./AdminIcons";

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
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
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(console.error);

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
      <div ref={sectionRef} className="mx-auto max-w-lg">
        <div
          className={`rounded-2xl border border-green-100 bg-white p-8 text-center shadow-sm transition-all duration-500 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900">
            Transaksi Berhasil!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Transaksi laundry telah tersimpan
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl bg-blue-50 p-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <ReceiptIcon className="h-4 w-4" />
                <span>Kode Resi</span>
              </div>
              <p className="mt-1 text-2xl font-bold tracking-wider text-blue-700">
                {result.receiptCode}
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <MoneyIcon className="h-4 w-4" />
                <span>Total Biaya</span>
              </div>
              <p className="mt-1 text-xl font-bold text-green-700">
                {formatRupiah(result.totalCost)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md"
          >
            <SaveIcon className="h-4 w-4" />
            Buat Transaksi Baru
          </button>
        </div>
      </div>
    );
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
          Transaksi Baru
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Tambahkan transaksi laundry baru
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8 transition-all duration-500 delay-75 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "150ms" }}
      >
        <div className="space-y-5">
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
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {weight} kg × {formatRupiah(selectedService.pricePerKg)}
                </span>
                <span className="text-sm font-semibold text-blue-700">
                  = {formatRupiah(estimatedCost)}
                </span>
              </div>
              <div className="mt-2 h-px bg-blue-100" />
              <p className="mt-2 text-xs text-gray-400">
                Estimasi: {selectedService.estimatedTime}
              </p>
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SaveIcon className="h-4 w-4" />
            {submitting ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </div>
      </form>
    </div>
  );
}
