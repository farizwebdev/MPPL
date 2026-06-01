import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const isOwner = cookie.includes("role=owner");
    if (!isOwner) {
      return NextResponse.json({ error: "Akses Ditolak" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const service = await prisma.service.update({
      where: { id },
      data: body,
    });

    if (!service) {
      return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (e) {
    return NextResponse.json({ error: "Gagal memperbarui layanan" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const isOwner = cookie.includes("role=owner");
    if (!isOwner) {
      return NextResponse.json({ error: "Akses Ditolak" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menghapus layanan" }, { status: 500 });
  }
}
