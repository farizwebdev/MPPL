"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";

interface PrintReceiptProps {
  transaction: any;
}

export default function PrintReceipt({ transaction }: PrintReceiptProps) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    // Auto trigger print dialogue when page loads
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen py-10 print:bg-white print:py-0">
      {/* 
        This acts as a preview on screen, and matches common thermal paper widths 
        (e.g. 58mm or 80mm). 300px is about 80mm.
      */}
      <div className="w-[300px] bg-white text-black p-4 text-xs font-mono shadow-md print:shadow-none print:w-full print:max-w-full print:p-0">
        
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold">ASE LAUNDRY</h1>
          <p>Jl. Contoh Alamat No. 123</p>
          <p>Telp: 08123456789</p>
          <div className="border-b border-dashed border-gray-400 mt-2 mb-2"></div>
        </div>

        {/* Transaction Info */}
        <div className="mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-24">No. Resi</td>
                <td>: {transaction.receiptCode}</td>
              </tr>
              <tr>
                <td>Tanggal</td>
                <td>: {new Date(transaction.createdAt).toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>Pelanggan</td>
                <td>: {transaction.customer.name}</td>
              </tr>
              <tr>
                <td>No. WA</td>
                <td>: {transaction.customer.noWa}</td>
              </tr>
            </tbody>
          </table>
          <div className="border-b border-dashed border-gray-400 mt-2 mb-2"></div>
        </div>

        {/* Order Info */}
        <div className="mb-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dashed border-gray-400">
                <th className="text-left font-normal pb-1">Layanan</th>
                <th className="text-right font-normal pb-1">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">
                  <div>{transaction.service.name}</div>
                  <div className="text-[10px] text-gray-600">
                    {transaction.totalWeight} kg x {formatRupiah(transaction.service.pricePerKg)}
                  </div>
                </td>
                <td className="text-right py-1 align-bottom">
                  {formatRupiah(transaction.totalCost)}
                </td>
              </tr>
            </tbody>
          </table>

          {transaction.totalPieces > 0 && (
            <div className="mt-1 text-gray-700">
              Total Potong: {transaction.totalPieces} pcs
            </div>
          )}
          
          {transaction.tallyDetails && Object.keys(transaction.tallyDetails).length > 0 && (
            <div className="mt-2 text-[10px]">
              <strong>Rincian Pakaian:</strong>
              <div className="grid grid-cols-2 gap-x-2 mt-1">
                {Object.entries(transaction.tallyDetails).map(([item, count]) => {
                  if (Number(count) > 0) {
                    return (
                      <div key={item} className="flex justify-between">
                        <span>{item}</span>
                        <span>{String(count)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          <div className="border-b border-dashed border-gray-400 mt-2 mb-2"></div>
        </div>

        {/* Footer */}
        <div className="mb-4">
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>{formatRupiah(transaction.totalCost)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Status Bayar</span>
            <span>{transaction.paymentStatus}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-gray-400 mb-4"></div>

        <div className="text-center text-[10px]">
          <p>Terima kasih telah mempercayakan</p>
          <p>cucian Anda pada kami!</p>
          <p className="mt-2 break-all">Cek status: {origin ? `${origin}/tracking?resi=${transaction.receiptCode}` : ""}</p>
        </div>

        {/* Anti-fraud banner */}
        <div className="mt-4 border-2 border-black p-2 text-center text-[9px] font-bold uppercase mb-4">
          PERHATIAN: CUCIAN ANDA GRATIS JIKA KASIR TIDAK MEMBERIKAN STRUK INI! (WAJIB DISIMPAN)
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="mt-8 flex gap-2 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-blue-600 text-white rounded py-2 shadow hover:bg-blue-700"
          >
            Cetak Lagi
          </button>
          <button 
            onClick={() => window.close()}
            className="flex-1 bg-gray-200 text-gray-800 rounded py-2 shadow hover:bg-gray-300"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
