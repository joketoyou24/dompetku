"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema, CategoryInput } from "@/lib/validations";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createCategory(input: CategoryInput) {
  const userId = await requireUserId();
  const data = categorySchema.parse(input);

  const category = await prisma.category.create({
    data: { ...data, userId, isDefault: false },
  });

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/budget");
  return category;
}

export async function updateCategory(id: string, input: CategoryInput) {
  const userId = await requireUserId();
  const owned = await prisma.category.findFirst({ where: { id, userId } });
  if (!owned) throw new Error("Kategori tidak ditemukan atau merupakan kategori default");

  const data = categorySchema.parse(input);
  const category = await prisma.category.update({ where: { id }, data });

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/budget");
  return category;
}

export async function deleteCategory(id: string) {
  const userId = await requireUserId();
  const owned = await prisma.category.findFirst({ where: { id, userId } });
  if (!owned) throw new Error("Kategori tidak ditemukan atau merupakan kategori default");

  const used = await prisma.transaction.findFirst({ where: { categoryId: id } });
  if (used) throw new Error("Kategori masih dipakai transaksi, tidak bisa dihapus");

  await prisma.category.delete({ where: { id } });

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/budget");
}
