import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/categories/category-manager";
import type { CategoryDTO } from "@/types";

export default async function CategoriesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const categories = await prisma.category.findMany({
    where: { OR: [{ userId }, { isDefault: true }] },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Kategori</h1>
        <p className="text-sm text-muted-foreground">
          Kelola kategori pemasukan dan pengeluaran. Kategori default tidak bisa diubah/dihapus.
        </p>
      </div>

      <CategoryManager categories={categories as unknown as CategoryDTO[]} />
    </div>
  );
}
