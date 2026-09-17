"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { savingGoalSchema, SavingGoalInput } from "@/lib/validations";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createSavingGoal(input: SavingGoalInput) {
  const userId = await requireUserId();
  const data = savingGoalSchema.parse(input);

  const goal = await prisma.savingGoal.create({
    data: {
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount ?? 0,
      deadline: data.deadline ? new Date(data.deadline) : null,
      userId,
    },
  });

  revalidatePath("/savings");
  revalidatePath("/dashboard");
  return goal;
}

export async function updateSavingGoal(id: string, input: Partial<SavingGoalInput>) {
  const userId = await requireUserId();
  const owned = await prisma.savingGoal.findFirst({ where: { id, userId } });
  if (!owned) throw new Error("Target tidak ditemukan");

  const data = savingGoalSchema.partial().parse(input);
  const { deadline, ...rest } = data;

  const goal = await prisma.savingGoal.update({
    where: { id },
    data: {
      ...rest,
      ...(deadline !== undefined ? { deadline: deadline ? new Date(deadline) : null } : {}),
    },
  });

  revalidatePath("/savings");
  revalidatePath("/dashboard");
  return goal;
}

export async function addFundsToGoal(id: string, amount: number) {
  const userId = await requireUserId();
  const owned = await prisma.savingGoal.findFirst({ where: { id, userId } });
  if (!owned) throw new Error("Target tidak ditemukan");

  const goal = await prisma.savingGoal.update({
    where: { id },
    data: { currentAmount: { increment: amount } },
  });

  revalidatePath("/savings");
  revalidatePath("/dashboard");
  return goal;
}

export async function deleteSavingGoal(id: string) {
  const userId = await requireUserId();
  const owned = await prisma.savingGoal.findFirst({ where: { id, userId } });
  if (!owned) throw new Error("Target tidak ditemukan");

  await prisma.savingGoal.delete({ where: { id } });
  revalidatePath("/savings");
  revalidatePath("/dashboard");
}
