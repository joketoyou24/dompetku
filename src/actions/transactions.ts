"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema, TransactionInput } from "@/lib/validations";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createTransaction(input: TransactionInput) {
  const userId = await requireUserId();
  const data = transactionSchema.parse(input);

  const transaction = await prisma.transaction.create({
    data: {
      date: new Date(data.date),
      type: data.type,
      amount: data.amount,
      description: data.description ?? null,
      paymentMethod: data.paymentMethod,
      categoryId: data.categoryId,
      userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  revalidatePath("/budget");
  return transaction;
}

export async function updateTransaction(id: string, input: TransactionInput) {
  const userId = await requireUserId();
  const owned = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!owned) throw new Error("Transaksi tidak ditemukan");

  const data = transactionSchema.parse(input);

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      date: new Date(data.date),
      type: data.type,
      amount: data.amount,
      description: data.description ?? null,
      paymentMethod: data.paymentMethod,
      categoryId: data.categoryId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  revalidatePath("/budget");
  return transaction;
}

export async function deleteTransaction(id: string) {
  const userId = await requireUserId();
  const owned = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!owned) throw new Error("Transaksi tidak ditemukan");

  await prisma.transaction.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  revalidatePath("/budget");
}
