import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TransactionDetail from "@/components/admin/TransactionDetail";

export const dynamic = "force-dynamic";

export default async function TransaksiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let transaction;
  try {
    transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { customer: true, service: true },
    });
  } catch {
    transaction = null;
  }

  if (!transaction) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Detail Transaksi
      </h1>
      <TransactionDetail
        transaction={{
          ...transaction,
          pickupDate: transaction.pickupDate?.toISOString() ?? null,
          createdAt: transaction.createdAt.toISOString(),
        }}
      />
    </div>
  );
}
