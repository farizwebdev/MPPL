import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  ANTREAN: "bg-gray-100 text-gray-600",
  DICUCI: "bg-blue-100 text-blue-700",
  DISETRIKA: "bg-purple-100 text-purple-700",
  SIAP_DIAMBIL: "bg-green-100 text-green-700",
  SELESAI: "bg-teal-100 text-teal-700",
  DISUMBANGKAN: "bg-yellow-100 text-yellow-700",
};

const statusLabels: Record<string, string> = {
  ANTREAN: "Antrean",
  DICUCI: "Dicuci",
  DISETRIKA: "Disetrika",
  SIAP_DIAMBIL: "Siap Diambil",
  SELESAI: "Selesai",
  DISUMBANGKAN: "Disumbangkan",
};

async function getTransactions() {
  try {
    return await prisma.transaction.findMany({
      include: { customer: true, service: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return [];
  }
}

export default async function TransaksiListPage() {
  const transactions = await getTransactions();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Transaksi</h1>
        <Link
          href="/transaksi/baru"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Transaksi Baru
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Resi</th>
              <th className="px-4 py-3 font-medium text-gray-600">Pelanggan</th>
              <th className="px-4 py-3 font-medium text-gray-600">Layanan</th>
              <th className="px-4 py-3 font-medium text-gray-600">Berat</th>
              <th className="px-4 py-3 font-medium text-gray-600">Biaya</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600">Pembayaran</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  Belum ada transaksi
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/transaksi/${t.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {t.receiptCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{t.customer.name}</p>
                    <p className="text-xs text-gray-400">{t.customer.noWa}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.service.name}</td>
                  <td className="px-4 py-3 text-gray-600">{t.totalWeight} kg</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {formatRupiah(t.totalCost)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColors[t.laundryStatus] || "bg-gray-100"
                      }`}
                    >
                      {statusLabels[t.laundryStatus] || t.laundryStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.paymentStatus === "LUNAS"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.paymentStatus === "LUNAS" ? "Lunas" : "Belum Lunas"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
