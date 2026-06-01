"use client";

import { useState, useEffect, useRef } from "react";
import { CustomerIcon } from "@/components/admin/AdminIcons";

interface Customer {
  id: string;
  name: string;
  noWa: string;
  alamat: string;
  createdAt: string;
}

export default function PelangganPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
    
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (Array.isArray(data)) setCustomers(data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={sectionRef}>
      <div className={`mb-6 transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Data Pelanggan</h1>
        <p className="mt-1 text-sm text-gray-500">Direktori seluruh pelanggan Ase Laundry</p>
      </div>

      <div className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-500 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">Pelanggan</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">Nomor WA</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">Alamat</th>
                  <th className="px-5 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xs uppercase">
                          {c.name.substring(0,2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-400">Bergabung: {new Date(c.createdAt).toLocaleDateString("id-ID")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-600">{c.noWa}</td>
                    <td className="px-5 py-4 text-gray-600 truncate max-w-[200px]">{c.alamat || "-"}</td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={`https://wa.me/${c.noWa.replace(/^0/, "62")}?text=Halo Kak ${c.name}, ada promo menarik dari Ase Laundry nih!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                      >
                        Kirim Promo
                      </a>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-500">Belum ada pelanggan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
