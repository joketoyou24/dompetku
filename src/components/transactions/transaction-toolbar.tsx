"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { TransactionFormDialog } from "./transaction-form-dialog";
import type { CategoryDTO } from "@/types";

export function TransactionToolbar({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openAdd, setOpenAdd] = useState(false);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <Select defaultValue={searchParams.get("type") ?? "ALL"} onValueChange={(v) => updateParam("type", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Jenis</SelectItem>
            <SelectItem value="INCOME">Pemasukan</SelectItem>
            <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue={searchParams.get("categoryId") ?? "ALL"} onValueChange={(v) => updateParam("categoryId", v)}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Kategori</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={() => setOpenAdd(true)} className="shrink-0">
        <Plus size={16} /> Tambah Transaksi
      </Button>

      <TransactionFormDialog open={openAdd} onOpenChange={setOpenAdd} categories={categories} />
    </div>
  );
}
