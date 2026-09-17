import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const category = await prisma.category.findFirst({ where: { id, userId: session.user.id } });
  if (!category) {
    return NextResponse.json({ error: "Kategori tidak ditemukan atau tidak bisa diubah" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const updated = await prisma.category.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const category = await prisma.category.findFirst({ where: { id, userId: session.user.id } });
  if (!category) {
    return NextResponse.json({ error: "Kategori tidak ditemukan atau tidak bisa dihapus" }, { status: 404 });
  }

  const used = await prisma.transaction.findFirst({ where: { categoryId: id } });
  if (used) {
    return NextResponse.json(
      { error: "Kategori masih dipakai transaksi, tidak bisa dihapus" },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
