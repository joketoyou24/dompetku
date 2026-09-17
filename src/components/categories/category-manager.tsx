"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { deleteCategory } from "@/actions/categories";
import { CategoryFormDialog } from "./category-form-dialog";
import type { CategoryDTO } from "@/types";

export function CategoryManager({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const [openAdd, setOpenAdd] = useState<"INCOME" | "EXPENSE" | null>(null);
  const [editing, setEditing] = useState<CategoryDTO | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const income = categories.filter((c) => c.type === "INCOME");
  const expense = categories.filter((c) => c.type === "EXPENSE");

  function handleDelete() {
    if (!deletingId) return;
    startTransition(async () => {
      try {
        await deleteCategory(deletingId);
        toast.success("Kategori dihapus");
        setDeletingId(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message ?? "Gagal menghapus kategori");
      }
    });
  }

  function renderGroup(title: string, type: "INCOME" | "EXPENSE", items: CategoryDTO[]) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{title}</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setOpenAdd(type)}>
            <Plus size={14} /> Tambah
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {items.map((c) => (
            <div
              key={c.id}
              className="group flex items-center gap-2 rounded-full border border-border pl-3 pr-1.5 py-1.5 text-sm"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color ?? "#6B7280" }} />
              {c.name}
              {c.isDefault ? (
                <Badge variant="outline" className="ml-0.5 text-[10px] py-0">
                  Default
                </Badge>
              ) : (
                <div className="flex items-center ml-0.5">
                  <button
                    onClick={() => setEditing(c)}
                    className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setDeletingId(c.id)}
                    className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {renderGroup("Kategori Pemasukan", "INCOME", income)}
      {renderGroup("Kategori Pengeluaran", "EXPENSE", expense)}

      {openAdd && (
        <CategoryFormDialog
          open={!!openAdd}
          onOpenChange={(open) => !open && setOpenAdd(null)}
          category={{ id: "", name: "", type: openAdd, icon: null, color: null, isDefault: false, userId: null }}
        />
      )}
      {editing && (
        <CategoryFormDialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)} category={editing} />
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori yang masih dipakai transaksi tidak bisa dihapus.
            </AlertDialogDescription>
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
    </div>
  );
}
