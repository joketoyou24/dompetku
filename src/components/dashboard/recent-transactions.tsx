import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionDTO } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function RecentTransactions({ transactions, currency }: { transactions: TransactionDTO[]; currency: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Transaksi Terakhir</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/transactions">Lihat semua</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1">
        {transactions.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">Belum ada transaksi</p>
        )}
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${
                  t.type === "INCOME" ? "bg-emerald-100 dark:bg-emerald-950" : "bg-red-100 dark:bg-red-950"
                }`}
              >
                {t.type === "INCOME" ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{t.category.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {t.description || "-"} · {formatDate(t.date)}
                </p>
              </div>
            </div>
            <p className={`text-sm font-semibold shrink-0 ${t.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {t.type === "INCOME" ? "+" : "-"}
              {formatCurrency(t.amount, currency)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
