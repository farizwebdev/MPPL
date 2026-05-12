import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { pricePerKg: "asc" },
    });
    return NextResponse.json(services);
  } catch (e) {
    console.error("Error fetching services:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal memuat layanan" },
      { status: 500 }
    );
  }
}
