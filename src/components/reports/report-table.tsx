import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PAYMENT_METHOD_LABEL } from "@/types";
import type { TransactionDTO } from "@/types";

export function ReportTable({ transactions, currency }: { transactions: TransactionDTO[]; currency: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Transaksi ({transactions.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">Tanggal</th>
                <th className="px-5 py-2.5 font-medium">Kategori</th>
                <th className="px-5 py-2.5 font-medium hidden sm:table-cell">Deskripsi</th>
                <th className="px-5 py-2.5 font-medium hidden sm:table-cell">Metode</th>
                <th className="px-5 py-2.5 font-medium text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    Tidak ada transaksi pada periode ini.
                  </td>
                </tr>
              )}
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-2.5 whitespace-nowrap">{formatDate(t.date)}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.category.color ?? "#6B7280" }} />
                      {t.category.name}
                    </div>
                  </td>
                  <td className="px-5 py-2.5 hidden sm:table-cell text-muted-foreground truncate max-w-[200px]">
                    {t.description || "-"}
                  </td>
                  <td className="px-5 py-2.5 hidden sm:table-cell">
                    <Badge variant="outline">{PAYMENT_METHOD_LABEL[t.paymentMethod]}</Badge>
                  </td>
                  <td
                    className={`px-5 py-2.5 text-right font-medium whitespace-nowrap ${
                      t.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(t.amount, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
