"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DashboardIcon,
  TransactionIcon,
  PlusIcon,
  ReportIcon,
  CustomerIcon,
  SettingsIcon,
  LogoutIcon,
} from "./AdminIcons";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const navItems = [
    { href: "/admin/transaksi", label: "Transaksi", icon: TransactionIcon, role: "all" },
    { href: "/admin/pelanggan", label: "Pelanggan", icon: CustomerIcon, role: "all" },
    { href: "/admin/shift", label: "Tutup Kasir", icon: ReportIcon, role: "karyawan" },
  ];
  
  // Extra nav items for Owner
  const ownerNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
    { href: "/admin/transaksi", label: "Transaksi", icon: TransactionIcon },
    { href: "/admin/pelanggan", label: "Pelanggan", icon: CustomerIcon },
    { href: "/admin/laporan", label: "Laporan", icon: ReportIcon },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: SettingsIcon },
  ];

  useEffect(() => {
    // We read from document.cookie "role" set by our mock API
    const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
    if (match) {
      setUserRole(match[2]);
    } else {
      setUserRole("karyawan"); // fallback
    }
  }, []);
  
  const activeNavItems = userRole === "owner" ? ownerNavItems : navItems;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  }

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 rounded-xl bg-blue-600 p-2.5 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md md:hidden print:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform bg-white shadow-sm transition-transform duration-300 md:relative md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="relative flex h-full flex-col">
          {/* Decorative gradient */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-50/50 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-50/30 blur-xl" />
          </div>

          {/* Logo */}
          <div className="relative border-b border-gray-100 px-6 py-6">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
                <svg viewBox="0 0 28 28" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
                  <rect x="4" y="8" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 12h20" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M10 8V4h8v4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M10 16l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Ase Laundry</h1>
                <p className="text-[11px] text-gray-400">Laundry Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="relative flex-1 space-y-1 px-3 py-5">
            {activeNavItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-sm"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer with Logout */}
          <div className="relative border-t border-gray-100 px-3 py-4">
            <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Akun
            </p>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-400 transition-all duration-200 group-hover:bg-red-100 group-hover:text-red-500">
                <LogoutIcon className="h-4 w-4" />
              </div>
              <span>{loggingOut ? "Keluar..." : "Keluar"}</span>
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
