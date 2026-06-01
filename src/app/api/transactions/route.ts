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
    const {
      customerName,
      noWa,
      alamat,
      serviceId,
      totalWeight,
      totalPieces,
      tallyDetails,
      paymentStatus,
      specialNotes,
      createdBy,
      createdRole
    } = body;

    if (!customerName || !noWa || !serviceId || !totalWeight || !totalPieces) {
      return NextResponse.json(
        { error: "Data wajib tidak lengkap" },
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

    const totalCost = service.pricePerKg * parseFloat(totalWeight);
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const receiptCode = `TRX-${dateStr}-${randomCode}`;

    let customer = await prisma.customer.findFirst({
      where: { noWa },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: customerName, noWa, alamat: alamat || "" },
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        receiptCode,
        customerId: customer.id,
        serviceId,
        totalWeight: parseFloat(totalWeight),
        totalPieces: parseInt(totalPieces),
        tallyDetails: tallyDetails || {},
        totalCost,
        paymentStatus: paymentStatus || "BELUM_LUNAS",
        laundryStatus: "ANTREAN",
        specialNotes,
        createdBy: createdBy || "Karyawan",
        createdRole: createdRole || "karyawan",
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
