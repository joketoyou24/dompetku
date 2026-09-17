"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createCategory, updateCategory } from "@/actions/categories";
import type { CategoryDTO, TransactionType } from "@/types";

const COLOR_OPTIONS = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#EF4444", "#14B8A6", "#6366F1", "#F97316", "#6B7280"];

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryDTO | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<TransactionType>(category?.type ?? "EXPENSE");
  const [color, setColor] = useState(category?.color ?? COLOR_OPTIONS[0]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      type,
      color,
      icon: null,
    };

    startTransition(async () => {
      try {
        if (category?.id) {
          await updateCategory(category.id, payload);
          toast.success("Kategori diperbarui");
        } else {
          await createCategory(payload);
          toast.success("Kategori ditambahkan");
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
          <DialogTitle>{category ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          <DialogDescription>Kategori kustom hanya terlihat oleh kamu.</DialogDescription>
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

          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Kategori</Label>
            <Input id="name" name="name" required defaultValue={category?.name} placeholder="Contoh: Langganan Streaming" />
          </div>

          <div className="space-y-1.5">
            <Label>Warna</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full ring-offset-2 ring-offset-background transition-all ${
                    color === c ? "ring-2 ring-foreground scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {category ? "Simpan Perubahan" : "Tambah Kategori"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
