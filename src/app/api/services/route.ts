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

export async function POST(request: Request) {
  try {
    // Basic auth check
    const cookie = request.headers.get("cookie") || "";
    const isOwner = cookie.includes("role=owner");
    if (!isOwner) {
      return NextResponse.json({ error: "Akses Ditolak" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.pricePerKg) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const service = await prisma.service.create({ data: body });
    return NextResponse.json(service, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Gagal membuat layanan" }, { status: 500 });
  }
}
