import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In a real DB we'd filter by today's date and createdBy/role
    // For prototype, we sum all paymentStatus = "TUNAI"
    const transactions = await prisma.transaction.findMany({
      where: {
        paymentStatus: "TUNAI",
      },
    });

    const totalTunai = transactions.reduce((acc: number, curr: any) => acc + curr.totalCost, 0);

    return NextResponse.json({ totalTunai });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat data shift" },
      { status: 500 }
    );
  }
}
