"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

const columns = [
  { id: "ANTREAN", label: "Antrean", color: "bg-gray-100 border-gray-200 text-gray-700" },
  { id: "DICUCI", label: "Dicuci", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: "DISETRIKA", label: "Disetrika", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: "SIAP_DIAMBIL", label: "Siap Diambil", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { id: "SELESAI", label: "Selesai", color: "bg-green-50 border-green-200 text-green-700" },
];

export default function TransactionBoard({ 
  transactions, 
  onUpdate 
}: { 
  transactions: any[]; 
  onUpdate: (id: string, updates: any) => Promise<void>;
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, targetStatus: string) {
    e.preventDefault();
    if (draggedId) {
      const item = transactions.find(t => t.id === draggedId);
      if (item && item.laundryStatus !== targetStatus) {
        onUpdate(draggedId, { laundryStatus: targetStatus });
      }
    }
    setDraggedId(null);
  }

  function moveStatus(t: any, direction: 'prev' | 'next') {
    const currentIndex = columns.findIndex(c => c.id === t.laundryStatus);
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < columns.length) {
      onUpdate(t.id, { laundryStatus: columns[newIndex].id });
    }
  }

  async function togglePayment(t: any) {
    const cycle: Record<string, string> = {
      "BELUM_LUNAS": "TUNAI",
      "TUNAI": "QRIS",
      "QRIS": "BELUM_LUNAS"
    };
    const newStatus = cycle[t.paymentStatus] || "TUNAI";
    await onUpdate(t.id, { paymentStatus: newStatus });
  }

  return (
    <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0">
      {columns.map((col) => {
        const columnItems = transactions.filter((t) => t.laundryStatus === col.id);
        
        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex-shrink-0 w-[85vw] sm:w-80 rounded-2xl border bg-gray-50/50 p-4 snap-center sm:snap-align-none transition-colors ${
              draggedId ? "border-dashed border-gray-300" : "border-gray-100"
            }`}
          >
            <div className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold shadow-sm ${col.color}`}>
              {col.label}
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/60 text-xs text-inherit">
                {columnItems.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 min-h-[150px]">
              {columnItems.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  className="group cursor-grab active:cursor-grabbing rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/admin/transaksi/${t.id}`} className="font-bold text-blue-600 hover:underline">
                      {t.receiptCode}
                    </Link>
                    <button 
                      onClick={() => togglePayment(t)}
                      title="Klik untuk ubah status pembayaran"
                      className={`text-[10px] font-bold px-2 py-1 rounded-full cursor-pointer transition-colors ${
                        t.paymentStatus === 'LUNAS' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                        t.paymentStatus === 'BELUM_LUNAS' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                        'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {t.paymentStatus === 'BELUM_LUNAS' ? 'BELUM LUNAS' : t.paymentStatus}
                    </button>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{t.customer.name}</p>
                  <p className="text-xs text-gray-500 mb-3">{t.customer.noWa}</p>
                  
                  <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">{t.service.name}</span>
                      <span className="text-sm font-bold text-gray-800">{formatRupiah(t.totalCost)}</span>
                    </div>
                    
                    {/* Mobile Friendly Move Buttons */}
                    <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveStatus(t, 'prev')}
                        disabled={col.id === columns[0].id}
                        className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 active:bg-gray-200 transition-all"
                        title="Pindah ke tahap sebelumnya"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveStatus(t, 'next')}
                        disabled={col.id === columns[columns.length - 1].id}
                        className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-100 active:bg-blue-200 transition-all"
                        title="Pindah ke tahap selanjutnya"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                         </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
