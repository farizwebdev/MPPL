import { prisma } from "@/lib/prisma";
import TransactionList from "@/components/admin/TransactionList";

export const dynamic = "force-dynamic";

async function getTransactions() {
  try {
    return await prisma.transaction.findMany({
      include: { customer: true, service: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return [];
  }
}

export default async function TransaksiListPage() {
  const transactions = await getTransactions();

  return <TransactionList transactions={transactions} />;
}
