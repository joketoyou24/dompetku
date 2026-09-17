"use client";

import { useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionDTO } from "@/types";

export function PdfExportListener({
  transactions,
  currency,
  periodLabel,
  totals,
}: {
  transactions: TransactionDTO[];
  currency: string;
  periodLabel: string;
  totals: { income: number; expense: number; balance: number };
}) {
  useEffect(() => {
    async function handleExport() {
      const { default: jsPDF } = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      const autoTable = autoTableModule.default;

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text("DompetKu", 14, 18);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Laporan Keuangan — ${periodLabel}`, 14, 26);

      doc.setFontSize(10);
      doc.text(`Total Pemasukan: ${formatCurrency(totals.income, currency)}`, 14, 36);
      doc.text(`Total Pengeluaran: ${formatCurrency(totals.expense, currency)}`, 14, 42);
      doc.text(`Saldo: ${formatCurrency(totals.balance, currency)}`, 14, 48);

      autoTable(doc, {
        startY: 56,
        head: [["Tanggal", "Jenis", "Kategori", "Deskripsi", "Metode", "Nominal"]],
        body: transactions.map((t) => [
          formatDate(t.date),
          t.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
          t.category.name,
          t.description ?? "-",
          t.paymentMethod,
          formatCurrency(t.amount, currency),
        ]),
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 8 },
      });

      doc.save("dompetku-laporan.pdf");
    }

    window.addEventListener("dompetku:export-pdf", handleExport);
    return () => window.removeEventListener("dompetku:export-pdf", handleExport);
  }, [transactions, currency, periodLabel, totals]);

  return null;
}
