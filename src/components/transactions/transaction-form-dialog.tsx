"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { createTransaction, updateTransaction } from "@/actions/transactions";
import { formatDateInput } from "@/lib/utils";
import type { CategoryDTO, TransactionDTO, TransactionType, PaymentMethod } from "@/types";
import { PAYMENT_METHOD_LABEL } from "@/types";

export function TransactionFormDialog({
  open,
  onOpenChange,
  categories,
  transaction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryDTO[];
  transaction?: TransactionDTO | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "EXPENSE");

  const filteredCategories = categories.filter((c) => c.type === type);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      date: formData.get("date") as string,
      type,
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
      paymentMethod: formData.get("paymentMethod") as PaymentMethod,
      categoryId: formData.get("categoryId") as string,
    };

    startTransition(async () => {
      try {
        if (transaction) {
          await updateTransaction(transaction.id, payload);
          toast.success("Transaksi berhasil diperbarui");
        } else {
          await createTransaction(payload);
          toast.success("Transaksi berhasil ditambahkan");
        }
        onOpenChange(false);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message ?? "Terjadi kesalahan");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Transaksi" : "Tambah Transaksi"}</DialogTitle>
          <DialogDescription>Lengkapi detail transaksi di bawah ini.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                type === "EXPENSE" ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950" : "border-border text-muted-foreground"
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                type === "INCOME" ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950" : "border-border text-muted-foreground"
              }`}
            >
              Pemasukan
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={transaction ? formatDateInput(transaction.date) : formatDateInput(new Date())}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Nominal (Rp)</Label>
              <Input id="amount" name="amount" type="number" min={1} step="any" required defaultValue={transaction?.amount} placeholder="0" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Kategori</Label>
            <Select name="categoryId" defaultValue={transaction?.categoryId} required>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
            <Select name="paymentMethod" defaultValue={transaction?.paymentMethod ?? "CASH"} required>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Pilih metode" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_METHOD_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Deskripsi (opsional)</Label>
            <Textarea id="description" name="description" placeholder="Contoh: Makan siang di kantor" defaultValue={transaction?.description ?? ""} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {transaction ? "Simpan Perubahan" : "Tambah Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
