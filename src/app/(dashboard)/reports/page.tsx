import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportTable } from "@/components/reports/report-table";
import { BalanceTrendChart } from "@/components/reports/balance-trend-chart";
import { PdfExportListener } from "@/components/reports/pdf-export-listener";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { formatDate, formatDateInput } from "@/lib/utils";
import type { TransactionDTO } from "@/types";

function resolveRange(period: string, from?: string, to?: string) {
  const now = new Date();
  let start: Date;
  let end: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  switch (period) {
    case "day":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week": {
      const day = now.getDay() || 7;
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    case "custom":
      start = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1);
      end = to ? new Date(new Date(to).setHours(23, 59, 59)) : end;
      break;
    case "month":
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;
  }
  return { start, end };
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}) {
  const session = await auth();
  const userId = session!.user.id;
  const sp = await searchParams;

  const period = sp.period ?? "month";
  const { start, end } = resolveRange(period, sp.from, sp.to);

  const [user, transactions] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { category: true },
      orderBy: { date: "desc" },
    }),
  ]);

  const currency = user?.currency ?? "IDR";
  const income = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

  // tren saldo harian dalam rentang (disederhanakan per hari, maksimal ditampilkan)
  const trendMap = new Map<string, number>();
  let running = 0;
  const sortedAsc = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  for (const t of sortedAsc) {
    running += t.type === "INCOME" ? t.amount : -t.amount;
    const key = formatDate(t.date, { day: "2-digit", month: "2-digit" });
    trendMap.set(key, running);
  }
  const trendData = Array.from(trendMap.entries()).map(([label, balance]) => ({ label, balance }));

  const periodLabel = `${formatDate(start)} — ${formatDate(end)}`;
  const txDTO = transactions.map((t) => ({ ...t, date: t.date.toISOString() })) as unknown as TransactionDTO[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Laporan</h1>
        <p className="text-sm text-muted-foreground">{periodLabel}</p>
      </div>

      <ReportFilters
        period={period}
        from={sp.from ?? formatDateInput(start)}
        to={sp.to ?? formatDateInput(end)}
      />

      <SummaryCards income={income} expense={expense} balance={balance} savingsRate={savingsRate} currency={currency} />

      {trendData.length > 1 && <BalanceTrendChart data={trendData} currency={currency} />}

      <ReportTable transactions={txDTO} currency={currency} />

      <PdfExportListener
        transactions={txDTO}
        currency={currency}
        periodLabel={periodLabel}
        totals={{ income, expense, balance }}
      />
    </div>
  );
}
