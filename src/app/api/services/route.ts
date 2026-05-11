import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { pricePerKg: "asc" },
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat layanan" },
      { status: 500 }
    );
  }
}
