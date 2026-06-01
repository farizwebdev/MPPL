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
  alamat: string;
  serviceId: string;
  totalWeight: string;
  totalPieces: string;
  paymentStatus: string;
  specialNotes: string;
}

interface FormErrors {
  customerName?: string;
  noWa?: string;
  alamat?: string;
  serviceId?: string;
  totalWeight?: string;
  totalPieces?: string;
}

const TALLY_ITEMS = ["Kemeja", "Celana", "Kaos", "Jaket", "Sprei", "Selimut"];

export default function TransactionForm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<FormData>({
    customerName: "",
    noWa: "",
    alamat: "",
    serviceId: "",
    totalWeight: "",
    totalPieces: "",
    paymentStatus: "BELUM_LUNAS",
    specialNotes: "",
  });
  
  const [tally, setTally] = useState<Record<string, number>>({});
  const [showTally, setShowTally] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    id: string;
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

  function handleTallyChange(item: string, delta: number) {
    setTally(prev => {
      const current = prev[item] || 0;
      const next = Math.max(0, current + delta);
      
      const newTally = { ...prev, [item]: next };
      
      // Auto-update total pieces
      const total = Object.values(newTally).reduce((a, b) => a + b, 0);
      setForm(f => ({ ...f, totalPieces: total.toString() }));
      
      return newTally;
    });
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.customerName.trim()) errs.customerName = "Nama pelanggan wajib diisi";
    if (!form.noWa.trim()) errs.noWa = "Nomor WhatsApp wajib diisi";
    if (!form.serviceId) errs.serviceId = "Pilih jenis layanan";
    if (!form.totalWeight || parseFloat(form.totalWeight) < 1)
      errs.totalWeight = "Berat minimal 1 kg";
    if (!form.totalPieces || parseInt(form.totalPieces) < 1)
      errs.totalPieces = "Jumlah potong minimal 1";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    
    // Read user role from cookie
    let role = "karyawan";
    const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
    if (match) role = match[2];

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          noWa: form.noWa,
          alamat: form.alamat,
          serviceId: form.serviceId,
          totalWeight: weight,
          totalPieces: parseInt(form.totalPieces) || 0,
          tallyDetails: tally,
          paymentStatus: form.paymentStatus,
          specialNotes: form.specialNotes || undefined,
          createdBy: role === "owner" ? "Owner" : "Karyawan",
          createdRole: role
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Gagal menyimpan transaksi");
        return;
      }

      const data = await res.json();
      setResult({ id: data.id, receiptCode: data.receiptCode, totalCost: data.totalCost });
      setForm({
        customerName: "",
        noWa: "",
        alamat: "",
        serviceId: "",
        totalWeight: "",
        totalPieces: "",
        paymentStatus: "BELUM_LUNAS",
        specialNotes: "",
      });
      setTally({});
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
                <span>Kode Resi Digital</span>
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

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`/cetak/${result.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 shadow-xs transition-all hover:bg-gray-200"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Cetak Nota Tempel
              </a>
              <a
                href={`https://wa.me/${form.noWa.replace(/^0/, "62")}?text=${encodeURIComponent(`Halo *${form.customerName}*,\n\nTerima kasih telah menggunakan jasa Ase Laundry.\n\nBerikut adalah resi digital Anda:\n📋 Resi: *${result.receiptCode}*\n💰 Total Biaya: ${formatRupiah(result.totalCost)}\n\nLacak status cucian Anda secara langsung di:\n${typeof window !== 'undefined' ? window.location.origin : ''}/tracking?resi=${result.receiptCode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-xs transition-all hover:bg-green-600 hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 21a9 9 0 006.5-15.5 9 9 0 00-13 0A8.96 8.96 0 004.14 11.6L3 19l7.35-1.15A9 9 0 0012 21z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 10a1 1 0 00-1 1v1a3 3 0 003 3h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1a1 1 0 01-1-1v-1a1 1 0 00-1-1H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Kirim Nota WA
              </a>
            </div>
            <button
              onClick={() => {
                setResult(null);
                setTally({});
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md"
            >
              <SaveIcon className="h-4 w-4" />
              Buat Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef}>
      <div
        className={`mb-6 transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Transaksi Kasir
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Tambahkan transaksi laundry baru (Mode Prototipe)
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8 transition-all duration-500 delay-75 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "150ms" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold border-b pb-2">Data Pelanggan</h3>
            <Input
              id="customerName"
              label="Nama Pelanggan"
              placeholder="Masukkan nama pelanggan"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
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

            <TextArea
              id="alamat"
              label="Alamat"
              placeholder="Jalan, RT/RW, Kecamatan"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            />
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-semibold border-b pb-2">Data Pesanan</h3>
            <Select
              id="serviceId"
              label="Kategori Layanan"
              options={services.map((s) => ({
                value: s.id,
                label: `${s.name} — ${formatRupiah(s.pricePerKg)}/kg (${s.estimatedTime})`,
              }))}
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
              error={errors.serviceId}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="totalWeight"
                label="Berat (kg)"
                type="number"
                step="0.1"
                min="1"
                placeholder="Mis: 2.5"
                value={form.totalWeight}
                onChange={(e) => setForm({ ...form, totalWeight: e.target.value })}
                error={errors.totalWeight}
              />
              <Input
                id="totalPieces"
                label="Total Potong (pcs)"
                type="number"
                min="1"
                placeholder="Mis: 10"
                value={form.totalPieces}
                onChange={(e) => setForm({ ...form, totalPieces: e.target.value })}
                error={errors.totalPieces}
              />
            </div>

            {/* Tally Counter Section */}
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Tally Counter (Opsional)</h4>
                <button
                  type="button"
                  onClick={() => setShowTally(!showTally)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {showTally ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
              
              {showTally && (
                <div className="grid grid-cols-2 gap-3">
                  {TALLY_ITEMS.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-lg bg-gray-50 p-2 border border-gray-100">
                      <span className="text-xs font-medium text-gray-700">{item}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleTallyChange(item, -1)} className="h-6 w-6 rounded bg-white shadow-sm border text-gray-500 hover:bg-gray-100">-</button>
                        <span className="text-xs w-4 text-center">{tally[item] || 0}</span>
                        <button type="button" onClick={() => handleTallyChange(item, 1)} className="h-6 w-6 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedService && weight > 0 && (
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {weight} kg × {formatRupiah(selectedService.pricePerKg)}
                  </span>
                  <span className="text-sm font-semibold text-blue-700">
                    = {formatRupiah(estimatedCost)}
                  </span>
                </div>
              </div>
            )}
            
            <Select
              id="paymentStatus"
              label="Status Pembayaran"
              options={[
                { value: "BELUM_LUNAS", label: "Belum Lunas" },
                { value: "TUNAI", label: "Tunai" },
                { value: "QRIS", label: "QRIS" },
              ]}
              value={form.paymentStatus}
              onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
            />

            <TextArea
              id="specialNotes"
              label="Catatan Khusus (opsional)"
              placeholder="Contoh: Baju luntur, Kaus kaki kurang 1"
              value={form.specialNotes}
              onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-8 pt-5 border-t">
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
