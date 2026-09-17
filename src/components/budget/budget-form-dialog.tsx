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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { upsertBudget } from "@/actions/budgets";
import type { BudgetDTO, CategoryDTO } from "@/types";

export function BudgetFormDialog({
  open,
  onOpenChange,
  categories,
  editing,
  month,
  year,
  usedCategoryIds,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryDTO[];
  editing: BudgetDTO | null;
  month: number;
  year: number;
  usedCategoryIds: string[];
}) {
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCategoryId(editing?.categoryId ?? "");
      setAmount(editing ? String(editing.amount) : "");
    }
  }, [open, editing]);

  const expenseCategories = categories.filter(
    (c) => c.type === "EXPENSE" && (editing ? true : !usedCategoryIds.includes(c.id))
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !amount) {
      toast.error("Lengkapi kategori dan nominal budget");
      return;
    }
    setLoading(true);
    try {
      await upsertBudget({ categoryId, amount: Number(amount), month, year });
      toast.success(editing ? "Anggaran diperbarui" : "Anggaran ditambahkan");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Gagal menyimpan anggaran");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Ubah Anggaran" : "Tambah Anggaran"}</DialogTitle>
          <DialogDescription>Atur batas pengeluaran bulanan per kategori.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={!!editing}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori pengeluaran" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Nominal Budget (Rp)</Label>
            <Input
              type="number"
              min={0}
              placeholder="2000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
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
