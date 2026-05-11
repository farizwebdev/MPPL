import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const startDate = start
      ? new Date(start + "T00:00:00.000Z")
      : new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = end
      ? new Date(end + "T23:59:59.999Z")
      : new Date(new Date().setHours(23, 59, 59, 999));

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      include: {
        customer: true,
        service: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRevenue = transactions.reduce(
      (sum, t) => sum + t.totalCost,
      0
    );
    const totalWeight = transactions.reduce(
      (sum, t) => sum + t.totalWeight,
      0
    );
    const totalTransactions = transactions.length;
    const paidCount = transactions.filter(
      (t) => t.paymentStatus === "LUNAS"
    ).length;

    return NextResponse.json({
      totalRevenue,
      totalWeight,
      totalTransactions,
      paidCount,
      unpaidCount: totalTransactions - paidCount,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Gagal memuat laporan" },
      { status: 500 }
    );
  }
}
