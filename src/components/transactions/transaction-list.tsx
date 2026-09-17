"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { deleteTransaction } from "@/actions/transactions";
import { TransactionFormDialog } from "./transaction-form-dialog";
import type { CategoryDTO, TransactionDTO } from "@/types";
import { PAYMENT_METHOD_LABEL } from "@/types";
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2, Loader2 } from "lucide-react";

export function TransactionList({
  transactions,
  categories,
  currency,
}: {
  transactions: TransactionDTO[];
  categories: CategoryDTO[];
  currency: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<TransactionDTO | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!deletingId) return;
    startTransition(async () => {
      try {
        await deleteTransaction(deletingId);
        toast.success("Transaksi dihapus");
        setDeletingId(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message ?? "Gagal menghapus transaksi");
      }
    });
  }

  if (transactions.length === 0) {
    return <p className="text-center text-sm text-muted-foreground py-16">Belum ada transaksi yang cocok dengan filter.</p>;
  }

  return (
    <>
      <div className="space-y-1">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-3 py-3 px-1 border-b border-border last:border-0 hover:bg-accent/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
                  t.type === "INCOME" ? "bg-emerald-100 dark:bg-emerald-950" : "bg-red-100 dark:bg-red-950"
                }`}
              >
                {t.type === "INCOME" ? (
                  <ArrowUpRight className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" size={18} />
                ) : (
                  <ArrowDownRight className="h-4.5 w-4.5 text-red-600 dark:text-red-400" size={18} />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{t.category.name}</p>
                  <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0">
                    {PAYMENT_METHOD_LABEL[t.paymentMethod]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {formatDate(t.date)} {t.description ? `· ${t.description}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <p className={`text-sm font-semibold mr-1 ${t.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {t.type === "INCOME" ? "+" : "-"}
                {formatCurrency(t.amount, currency)}
              </p>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(t)}>
                <Pencil size={15} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => setDeletingId(t.id)}>
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <TransactionFormDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          categories={categories}
          transaction={editing}
        />
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus transaksi ini?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
