"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/savings/circular-progress";
import { Pencil, Trash2, PlusCircle, Calendar } from "lucide-react";
import { formatCurrency, formatDate, percentage } from "@/lib/utils";
import { deleteSavingGoal } from "@/actions/savings";
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
import type { SavingGoalDTO } from "@/types";

export function SavingGoalCard({
  goal,
  currency,
  onEdit,
  onAddFunds,
}: {
  goal: SavingGoalDTO;
  currency: string;
  onEdit: (goal: SavingGoalDTO) => void;
  onAddFunds: (goal: SavingGoalDTO) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const pct = percentage(goal.currentAmount, goal.targetAmount);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteSavingGoal(goal.id);
      toast.success("Target tabungan dihapus");
    } catch (e: any) {
      toast.error(e.message ?? "Gagal menghapus target");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-5 flex gap-4 items-center">
        <CircularProgress value={pct} />

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium truncate">{goal.name}</p>
            <div className="flex items-center gap-0.5 shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(goal)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus target "{goal.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription>
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

          <p className="text-sm text-muted-foreground">
            {formatCurrency(goal.currentAmount, currency)}{" "}
            <span className="text-muted-foreground/70">/ {formatCurrency(goal.targetAmount, currency)}</span>
          </p>

          {goal.deadline && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(goal.deadline)}
            </p>
          )}

          <Button size="sm" variant="secondary" className="gap-1.5 mt-1" onClick={() => onAddFunds(goal)}>
            <PlusCircle className="h-3.5 w-3.5" /> Tambah Dana
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
