"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login gagal");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-100/40 to-transparent blur-3xl" />
        <div className="absolute bottom-20 left-10 h-40 w-40 rounded-full bg-blue-50/30 blur-2xl" />
        <div className="absolute top-40 right-10 h-48 w-48 rounded-full bg-blue-50/20 blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #2563EB 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md">
            <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7" aria-hidden="true">
              <rect x="4" y="8" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 12h20" stroke="currentColor" strokeWidth="1.8" />
              <path d="M10 8V4h8v4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M10 16l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Ase Laundry
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Masuk ke panel admin
          </p>
        </div>

        {/* Login Form Prototype */}
        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-500 mb-6">Pilih akses prototipe:</p>
            
            <button
              onClick={() => { setUsername("karyawan"); setPassword("karyawan123"); setTimeout(handleSubmit, 100); }}
              disabled={loading}
              className="flex w-full items-center justify-between rounded-xl border-2 border-blue-100 bg-blue-50/50 p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
            >
              <div className="text-left">
                <p className="font-semibold text-blue-900">Masuk sebagai Karyawan</p>
                <p className="text-xs text-blue-600/70">Akses operasional kasir & status</p>
              </div>
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => { setUsername("owner"); setPassword("owner123"); setTimeout(handleSubmit, 100); }}
              disabled={loading}
              className="flex w-full items-center justify-between rounded-xl border-2 border-purple-100 bg-purple-50/50 p-4 transition-all hover:border-purple-500 hover:bg-purple-50"
            >
              <div className="text-left">
                <p className="font-semibold text-purple-900">Masuk sebagai Owner</p>
                <p className="text-xs text-purple-600/70">Akses penuh & laporan keuangan</p>
              </div>
              <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 flex-shrink-0 text-red-500" aria-hidden="true">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="hidden">
               {/* Hidden form to maintain original handleSubmit logic */}
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Ase Laundry v1.0 &mdash; Laundry Management System
        </p>
      </div>
    </div>
  );
}
