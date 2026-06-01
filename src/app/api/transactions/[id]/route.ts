import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { customer: true, service: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat transaksi" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};

    if (body.laundryStatus) data.laundryStatus = body.laundryStatus;
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus;
    if (body.pickupDate !== undefined) {
      data.pickupDate = body.pickupDate ? new Date(body.pickupDate) : null;
    }
    if (body.specialNotes !== undefined) data.specialNotes = body.specialNotes;
    if (body.updatedBy) data.updatedBy = body.updatedBy;
    if (body.updatedRole) data.updatedRole = body.updatedRole;

    const transaction = await prisma.transaction.update({
      where: { id },
      data,
      include: { customer: true, service: true },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui transaksi" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const roleCookie = request.cookies.get("role");
    if (!roleCookie || roleCookie.value !== "owner") {
      return NextResponse.json(
        { error: "Akses Ditolak. Hanya Owner yang dapat menghapus transaksi." },
        { status: 403 }
      );
    }
    
    const { id } = await params;
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus transaksi" },
      { status: 500 }
    );
  }
}
