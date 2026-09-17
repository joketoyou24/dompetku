import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");
  const limit = searchParams.get("limit");

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      ...(from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : {}),
      ...(type ? { type } : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    orderBy: { date: "desc" },
    take: limit ? parseInt(limit) : undefined,
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = transactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { date, type, amount, description, paymentMethod, categoryId } = parsed.data;

  const transaction = await prisma.transaction.create({
    data: {
      date: new Date(date),
      type,
      amount,
      description: description ?? null,
      paymentMethod,
      categoryId,
      userId: session.user.id,
    },
    include: { category: true },
  });

  return NextResponse.json(transaction, { status: 201 });
}
