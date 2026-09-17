import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BudgetBoard } from "@/components/budget/budget-board";
import { MonthYearSwitcher } from "@/components/budget/month-year-switcher";
import { monthName } from "@/lib/utils";

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const sp = await searchParams;

  const now = new Date();
  const month = sp.month ? parseInt(sp.month) : now.getMonth() + 1;
  const year = sp.year ? parseInt(sp.year) : now.getFullYear();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const currency = user?.currency ?? "IDR";

  const [budgets, categories] = await Promise.all([
    prisma.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
      orderBy: { category: { name: "asc" } },
    }),
    prisma.category.findMany({
      where: { OR: [{ userId }, { isDefault: true }] },
      orderBy: { name: "asc" },
    }),
  ]);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const budgetsWithSpent = await Promise.all(
    budgets.map(async (b) => {
      const agg = await prisma.transaction.aggregate({
        where: { userId, categoryId: b.categoryId, type: "EXPENSE", date: { gte: start, lte: end } },
        _sum: { amount: true },
      });
      return { ...b, spent: agg._sum.amount ?? 0 };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Anggaran Bulanan</h1>
          <p className="text-sm text-muted-foreground">
            Pantau batas pengeluaran untuk {monthName(month)} {year}
          </p>
        </div>
        <MonthYearSwitcher month={month} year={year} />
      </div>

      <BudgetBoard
        budgets={budgetsWithSpent as any}
        categories={categories as any}
        currency={currency}
        month={month}
        year={year}
      />
    </div>
  );
}
