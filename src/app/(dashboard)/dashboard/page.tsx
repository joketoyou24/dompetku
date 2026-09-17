import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { monthName } from "@/lib/utils";
import type { TransactionDTO } from "@/types";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const currency = user?.currency ?? "IDR";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const [transactionsThisMonth, recentTransactions] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { category: true },
    }),
    prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  const income = transactionsThisMonth.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expense = transactionsThisMonth.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

  // Data 6 bulan terakhir untuk bar chart
  const monthsData: { label: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const txs = await prisma.transaction.findMany({
      where: { userId, date: { gte: mStart, lte: mEnd } },
    });
    monthsData.push({
      label: monthName(d.getMonth() + 1).slice(0, 3),
      income: txs.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0),
      expense: txs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
    });
  }

  // Data pie chart kategori pengeluaran bulan ini
  const expenseByCategory = new Map<string, { name: string; value: number; color?: string | null }>();
  for (const t of transactionsThisMonth) {
    if (t.type !== "EXPENSE") continue;
    const existing = expenseByCategory.get(t.categoryId);
    if (existing) existing.value += t.amount;
    else expenseByCategory.set(t.categoryId, { name: t.category.name, value: t.amount, color: t.category.color });
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Halo, {user?.name?.split(" ")[0] ?? "Sobat Hemat"} 👋</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan keuangan {monthName(month)} {year}
        </p>
      </div>

      <SummaryCards income={income} expense={expense} balance={balance} savingsRate={savingsRate} currency={currency} />

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <IncomeExpenseChart data={monthsData} currency={currency} />
        <CategoryPieChart data={Array.from(expenseByCategory.values())} currency={currency} />
      </div>

      <RecentTransactions
        transactions={recentTransactions.map((t) => ({
          ...t,
          date: t.date.toISOString(),
        })) as unknown as TransactionDTO[]}
        currency={currency}
      />
    </div>
  );
}
