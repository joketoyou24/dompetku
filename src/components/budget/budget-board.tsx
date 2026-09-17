"use client";

import { useState } from "react";
import { Plus, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetCard } from "@/components/budget/budget-card";
import { BudgetFormDialog } from "@/components/budget/budget-form-dialog";
import type { BudgetDTO, CategoryDTO } from "@/types";

export function BudgetBoard({
  budgets,
  categories,
  currency,
  month,
  year,
}: {
  budgets: BudgetDTO[];
  categories: CategoryDTO[];
  currency: string;
  month: number;
  year: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetDTO | null>(null);

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(b: BudgetDTO) {
    setEditing(b);
    setDialogOpen(true);
  }

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total anggaran: <span className="font-medium text-foreground">{budgets.length} kategori</span>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Tambah Anggaran
        </Button>
      </div>

      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <PiggyBank className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">Belum ada anggaran bulan ini</p>
          <p className="text-sm text-muted-foreground mb-4">Buat anggaran per kategori agar pengeluaran lebih terkontrol.</p>
          <Button onClick={openAdd} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Tambah Anggaran
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetCard key={b.id} budget={b} currency={currency} onEdit={openEdit} />
          ))}
        </div>
      )}

      <BudgetFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        editing={editing}
        month={month}
        year={year}
        usedCategoryIds={budgets.map((b) => b.categoryId)}
      />
    </div>
  );
}
