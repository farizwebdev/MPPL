"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackingWidget() {
  const router = useRouter();
  const [resi, setResi] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (resi.trim()) {
      router.push(`/tracking?resi=${encodeURIComponent(resi.trim())}`);
    }
  }

  return (
    <section className="bg-blue-600 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Lacak Cucian Anda Sekarang
        </h2>
        <p className="mt-3 text-blue-100">
          Masukkan nomor resi untuk melihat status terbaru cucian Anda
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={resi}
            onChange={(e) => setResi(e.target.value)}
            placeholder="Masukkan nomor resi..."
            className="flex-1 rounded-xl border-0 px-5 py-3.5 text-sm text-gray-900 shadow-sm outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-8 py-3.5 text-sm font-medium text-blue-600 shadow-sm transition-all hover:bg-blue-50"
          >
            Lacak
          </button>
        </form>

        <p className="mt-4 text-sm text-blue-200">
          Atau{" "}
          <a
            href="/tracking"
            className="font-medium text-white underline underline-offset-2 hover:no-underline"
          >
            cari berdasarkan nomor HP
          </a>
        </p>
      </div>
    </section>
  );
}
