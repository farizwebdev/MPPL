import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintReceipt from "./PrintReceipt";

export const dynamic = "force-dynamic";

export default async function CetakNotaPage({
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

  // Convert dates and prepare data for client component
  const transactionData = {
    ...transaction,
    createdAt: transaction.createdAt.toISOString(),
    pickupDate: transaction.pickupDate ? transaction.pickupDate.toISOString() : null,
  };

  return <PrintReceipt transaction={transactionData} />;
}
