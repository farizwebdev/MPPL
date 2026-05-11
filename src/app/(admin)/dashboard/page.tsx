import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalTransactions, todayTransactions, services] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.findMany({
        where: { createdAt: { gte: today } },
        include: { service: true },
      }),
      prisma.service.findMany(),
    ]);

    const todayRevenue = todayTransactions.reduce(
      (sum, t) => sum + t.totalCost,
      0
    );
    const todayWeight = todayTransactions.reduce(
      (sum, t) => sum + t.totalWeight,
      0
    );

    return { totalTransactions, todayRevenue, todayWeight, services };
  } catch {
    return {
      totalTransactions: 0,
      todayRevenue: 0,
      todayWeight: 0,
      services: [],
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">
            {stats.totalTransactions}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pendapatan Hari Ini</p>
          <p className="mt-1 text-3xl font-bold text-green-600">
            {formatRupiah(stats.todayRevenue)}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Berat Hari Ini</p>
          <p className="mt-1 text-3xl font-bold text-purple-600">
            {stats.todayWeight} kg
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Daftar Layanan
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.services.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <p className="font-medium text-gray-800">{s.name}</p>
              <p className="mt-1 text-sm text-gray-500">
                {formatRupiah(s.pricePerKg)} / kg
              </p>
              <p className="text-xs text-gray-400">Estimasi: {s.estimatedTime}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
