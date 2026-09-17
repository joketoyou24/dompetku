import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const format = searchParams.get("format") ?? "csv";

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      ...(from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : {}),
    },
    include: { category: true },
    orderBy: { date: "asc" },
  });

  if (format === "json") {
    return NextResponse.json(transactions);
  }

  // CSV
  const header = ["Tanggal", "Jenis", "Kategori", "Deskripsi", "Metode Pembayaran", "Nominal"];
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
    t.category.name,
    (t.description ?? "").replace(/,/g, ";"),
    t.paymentMethod,
    t.amount.toString(),
  ]);

  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const bom = "\uFEFF"; // agar Excel membaca UTF-8 dengan benar

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dompetku-laporan.csv"`,
    },
  });
}
