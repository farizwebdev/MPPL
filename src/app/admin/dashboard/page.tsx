import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/admin/DashboardStats";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "owner") {
    redirect("/admin/transaksi");
  }

  const stats = await getStats();

  return (
    <DashboardStats
      totalTransactions={stats.totalTransactions}
      todayRevenue={stats.todayRevenue}
      todayWeight={stats.todayWeight}
      services={stats.services}
    />
  );
}
