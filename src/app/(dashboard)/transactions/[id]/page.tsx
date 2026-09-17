import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PAYMENT_METHOD_LABEL, TRANSACTION_TYPE_LABEL } from "@/types";
import { ArrowLeft } from "lucide-react";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session!.user.id;
  const { id } = await params;

  const [user, transaction] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.transaction.findFirst({ where: { id, userId }, include: { category: true } }),
  ]);

  if (!transaction) notFound();

  const currency = user?.currency ?? "IDR";

  const rows: { label: string; value: string }[] = [
    { label: "Tanggal", value: formatDate(transaction.date, { day: "2-digit", month: "long", year: "numeric" }) },
    { label: "Jenis", value: TRANSACTION_TYPE_LABEL[transaction.type as "INCOME" | "EXPENSE"] },
    { label: "Kategori", value: transaction.category.name },
    { label: "Metode Pembayaran", value: PAYMENT_METHOD_LABEL[transaction.paymentMethod as "CASH" | "BANK" | "EWALLET"] },
    { label: "Deskripsi", value: transaction.description || "-" },
  ];

  return (
    <div className="space-y-5 max-w-xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/transactions">
          <ArrowLeft size={16} /> Kembali
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Transaksi</CardTitle>
            <Badge variant={transaction.type === "INCOME" ? "success" : "danger"}>
              {transaction.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p
            className={`text-3xl font-bold ${
              transaction.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {transaction.type === "INCOME" ? "+" : "-"}
            {formatCurrency(transaction.amount, currency)}
          </p>

          <div className="divide-y divide-border border-t border-border pt-2">
            {rows.map((r) => (
              <div key={r.label} className="flex justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-medium text-right">{r.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
