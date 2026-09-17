"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { budgetSchema, BudgetInput } from "@/lib/validations";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function upsertBudget(input: BudgetInput) {
  const userId = await requireUserId();
  const data = budgetSchema.parse(input);

  const budget = await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId,
        categoryId: data.categoryId,
        month: data.month,
        year: data.year,
      },
    },
    update: { amount: data.amount },
    create: { ...data, userId },
  });

  revalidatePath("/budget");
  revalidatePath("/dashboard");
  return budget;
}

export async function deleteBudget(id: string) {
  const userId = await requireUserId();
  const owned = await prisma.budget.findFirst({ where: { id, userId } });
  if (!owned) throw new Error("Budget tidak ditemukan");

  await prisma.budget.delete({ where: { id } });
  revalidatePath("/budget");
  revalidatePath("/dashboard");
}
