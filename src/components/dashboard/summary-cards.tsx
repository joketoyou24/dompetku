import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

export function SummaryCards({
  income,
  expense,
  balance,
  savingsRate,
  currency,
}: {
  income: number;
  expense: number;
  balance: number;
  savingsRate: number;
  currency: string;
}) {
  const cards = [
    {
      label: "Total Pemasukan",
      value: formatCurrency(income, currency),
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-950",
    },
    {
      label: "Total Pengeluaran",
      value: formatCurrency(expense, currency),
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-950",
    },
    {
      label: "Saldo",
      value: formatCurrency(balance, currency),
      icon: Wallet,
      color: balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
      bg: balance >= 0 ? "bg-emerald-100 dark:bg-emerald-950" : "bg-red-100 dark:bg-red-950",
    },
    {
      label: "Persentase Tabungan",
      value: `${savingsRate}%`,
      icon: PiggyBank,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-100 dark:bg-teal-950",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="p-4 md:p-5">
            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center mb-3", c.bg)}>
              <c.icon className={cn("h-4.5 w-4.5", c.color)} size={18} />
            </div>
            <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
            <p className="text-base md:text-xl font-semibold truncate">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
