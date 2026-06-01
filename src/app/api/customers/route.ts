import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany();
    // In a real app we might also fetch how many transactions they made.
    // For mock, we can just return the customers directly.
    return NextResponse.json(customers);
  } catch (e) {
    return NextResponse.json(
      { error: "Gagal memuat data pelanggan" },
      { status: 500 }
    );
  }
}
