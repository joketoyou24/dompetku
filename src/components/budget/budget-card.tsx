"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, percentage, budgetColor, budgetTextColor } from "@/lib/utils";
import { deleteBudget } from "@/actions/budgets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { BudgetDTO } from "@/types";

export function BudgetCard({
  budget,
  currency,
  onEdit,
}: {
  budget: BudgetDTO;
  currency: string;
  onEdit: (budget: BudgetDTO) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const pct = percentage(budget.spent, budget.amount);
  const remaining = budget.amount - budget.spent;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteBudget(budget.id);
      toast.success("Anggaran dihapus");
    } catch (e: any) {
      toast.error(e.message ?? "Gagal menghapus anggaran");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{budget.category.name}</p>
            <p className="text-xs text-muted-foreground">
              Budget {formatCurrency(budget.amount, currency)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(budget)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus anggaran ini?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anggaran untuk kategori "{budget.category.name}" bulan ini akan dihapus.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction disabled={deleting} onClick={handleDelete}>
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Progress value={pct} indicatorClassName={budgetColor(pct)} />

        <div className="flex items-center justify-between text-xs">
          <span className={budgetTextColor(pct)}>
            Terpakai {formatCurrency(budget.spent, currency)} ({pct}%)
          </span>
          <span className="text-muted-foreground">
            Sisa {remaining >= 0 ? formatCurrency(remaining, currency) : `-${formatCurrency(Math.abs(remaining), currency)}`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
