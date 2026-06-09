"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function performLogin(u: string, p: string) {
    setError("");
    setLoading(true);
    // Jika lewat demo button, pastikan input state ikut berubah secara visual
    setUsername(u);
    setPassword(p);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      if (res.ok) {
        window.location.href = "/admin/dashboard";
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

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    await performLogin(username, password);
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

        {/* Login Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Masukkan username Anda"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Masukkan password Anda"
              />
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Quick Demo Buttons for Prototype */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="mb-3 text-center text-xs font-medium text-gray-500">Prototipe Akses Cepat</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => performLogin("owner", "owner123")}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50"
              >
                Masuk Owner
              </button>
              <button
                type="button"
                onClick={() => performLogin("karyawan", "karyawan123")}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50"
              >
                Masuk Karyawan
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Ase Laundry v1.0 &mdash; Laundry Management System
        </p>
      </div>
    </div>
  );
}
