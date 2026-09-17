import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id, month, year },
    include: { category: true },
    orderBy: { category: { name: "asc" } },
  });

  const budgetsWithSpent = await Promise.all(
    budgets.map(async (b) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      const agg = await prisma.transaction.aggregate({
        where: {
          userId: session.user.id,
          categoryId: b.categoryId,
          type: "EXPENSE",
          date: { gte: start, lte: end },
        },
        _sum: { amount: true },
      });
      return { ...b, spent: agg._sum.amount ?? 0 };
    })
  );

  return NextResponse.json(budgetsWithSpent);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = budgetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const budget = await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: session.user.id,
        categoryId: parsed.data.categoryId,
        month: parsed.data.month,
        year: parsed.data.year,
      },
    },
    update: { amount: parsed.data.amount },
    create: { ...parsed.data, userId: session.user.id },
    include: { category: true },
  });

  return NextResponse.json(budget, { status: 201 });
}
