import { prisma } from "@/lib/prisma";
import { generateReceiptCode, sanitizeReceiptCode } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        skip,
        take: limit,
        include: { customer: true, service: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.transaction.count(),
    ]);

    return NextResponse.json({
      data: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat transaksi" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, noWa, serviceId, totalWeight, specialNotes } = body;

    if (!customerName || !noWa || !serviceId || !totalWeight) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (totalWeight < 2) {
      return NextResponse.json(
        { error: "Berat minimal 2 kg" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    const totalCost = Math.round(totalWeight * service.pricePerKg);
    const rawCode = generateReceiptCode();
    const receiptCode = sanitizeReceiptCode(rawCode);

    let customer = await prisma.customer.findFirst({
      where: { noWa: noWa },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: customerName, noWa },
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        receiptCode,
        customerId: customer.id,
        serviceId: service.id,
        totalWeight,
        totalCost,
        specialNotes: specialNotes || null,
      },
      include: {
        customer: true,
        service: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Gagal membuat transaksi" },
      { status: 500 }
    );
  }
}
