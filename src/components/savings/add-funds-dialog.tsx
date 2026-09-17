"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addFundsToGoal } from "@/actions/savings";
import type { SavingGoalDTO } from "@/types";

export function AddFundsDialog({
  open,
  onOpenChange,
  goal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: SavingGoalDTO | null;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal || !amount || Number(amount) <= 0) {
      toast.error("Masukkan nominal yang valid");
      return;
    }
    setLoading(true);
    try {
      await addFundsToGoal(goal.id, Number(amount));
      toast.success("Dana berhasil ditambahkan");
      setAmount("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Gagal menambah dana");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Dana</DialogTitle>
          <DialogDescription>{goal ? `Menambah dana untuk target "${goal.name}"` : ""}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nominal (Rp)</Label>
            <Input
              type="number"
              min={0}
              autoFocus
              placeholder="500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Tambahkan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
