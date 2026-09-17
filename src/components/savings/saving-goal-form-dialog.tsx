"use client";

import { useEffect, useState } from "react";
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
import { createSavingGoal, updateSavingGoal } from "@/actions/savings";
import { formatDateInput } from "@/lib/utils";
import type { SavingGoalDTO } from "@/types";

export function SavingGoalFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: SavingGoalDTO | null;
}) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setTargetAmount(editing ? String(editing.targetAmount) : "");
      setCurrentAmount(editing ? String(editing.currentAmount) : "0");
      setDeadline(editing?.deadline ? formatDateInput(editing.deadline) : "");
    }
  }, [open, editing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !targetAmount) {
      toast.error("Lengkapi nama dan nominal target");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await updateSavingGoal(editing.id, {
          name,
          targetAmount: Number(targetAmount),
          currentAmount: Number(currentAmount || 0),
          deadline: deadline || null,
        });
        toast.success("Target diperbarui");
      } else {
        await createSavingGoal({
          name,
          targetAmount: Number(targetAmount),
          currentAmount: Number(currentAmount || 0),
          deadline: deadline || null,
        });
        toast.success("Target tabungan dibuat");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Gagal menyimpan target");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Ubah Target Tabungan" : "Target Tabungan Baru"}</DialogTitle>
          <DialogDescription>Tetapkan target dan pantau progresnya.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Target</Label>
            <Input placeholder="Dana Darurat, Liburan, dll" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nominal Target (Rp)</Label>
              <Input type="number" min={0} value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Sudah Terkumpul (Rp)</Label>
              <Input type="number" min={0} value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Deadline (opsional)</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
