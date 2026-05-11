import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resi = searchParams.get("resi");
    const phone = searchParams.get("phone");

    if (!resi && !phone) {
      return NextResponse.json(
        { error: "Masukkan nomor resi atau nomor HP" },
        { status: 400 }
      );
    }

    let transactions;

    if (resi) {
      transactions = await prisma.transaction.findMany({
        where: { receiptCode: { contains: resi, mode: "insensitive" } },
        include: { customer: true, service: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      const customers = await prisma.customer.findMany({
        where: { noWa: { contains: phone! } },
        select: { id: true },
      });

      transactions = await prisma.transaction.findMany({
        where: { customerId: { in: customers.map((c) => c.id) } },
        include: { customer: true, service: true },
        orderBy: { createdAt: "desc" },
      });
    }

    if (transactions.length === 0) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json(
      { error: "Gagal melacak transaksi" },
      { status: 500 }
    );
  }
}
