import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionToolbar } from "@/components/transactions/transaction-toolbar";
import { TransactionList } from "@/components/transactions/transaction-list";
import type { TransactionDTO } from "@/types";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; categoryId?: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const params = await searchParams;

  const [user, categories, transactions] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.category.findMany({
      where: { OR: [{ userId }, { isDefault: true }] },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        ...(params.type ? { type: params.type } : {}),
        ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      },
      include: { category: true },
      orderBy: { date: "desc" },
    }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Transaksi</h1>
        <p className="text-sm text-muted-foreground">Kelola semua pemasukan dan pengeluaranmu.</p>
      </div>

      <TransactionToolbar categories={categories as any} />

      <Card>
        <CardContent className="p-3 md:p-5">
          <TransactionList
            transactions={transactions.map((t) => ({ ...t, date: t.date.toISOString() })) as unknown as TransactionDTO[]}
            categories={categories as any}
            currency={user?.currency ?? "IDR"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
