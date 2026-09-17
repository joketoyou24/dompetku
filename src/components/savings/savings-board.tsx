"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavingGoalCard } from "@/components/savings/saving-goal-card";
import { SavingGoalFormDialog } from "@/components/savings/saving-goal-form-dialog";
import { AddFundsDialog } from "@/components/savings/add-funds-dialog";
import type { SavingGoalDTO } from "@/types";

export function SavingsBoard({ goals, currency }: { goals: SavingGoalDTO[]; currency: string }) {
  const [formOpen, setFormOpen] = useState(false);
  const [fundsOpen, setFundsOpen] = useState(false);
  const [editing, setEditing] = useState<SavingGoalDTO | null>(null);
  const [addingTo, setAddingTo] = useState<SavingGoalDTO | null>(null);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(g: SavingGoalDTO) {
    setEditing(g);
    setFormOpen(true);
  }
  function openAddFunds(g: SavingGoalDTO) {
    setAddingTo(g);
    setFundsOpen(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <Button onClick={openAdd} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Target Baru
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Target className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">Belum ada target tabungan</p>
          <p className="text-sm text-muted-foreground mb-4">Buat target untuk dana darurat, liburan, atau impianmu.</p>
          <Button onClick={openAdd} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> Buat Target
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => (
            <SavingGoalCard key={g.id} goal={g} currency={currency} onEdit={openEdit} onAddFunds={openAddFunds} />
          ))}
        </div>
      )}

      <SavingGoalFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <AddFundsDialog open={fundsOpen} onOpenChange={setFundsOpen} goal={addingTo} />
    </div>
  );
}
