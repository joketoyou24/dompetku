"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PERIODS = [
  { key: "day", label: "Hari" },
  { key: "week", label: "Minggu" },
  { key: "month", label: "Bulan" },
  { key: "year", label: "Tahun" },
  { key: "custom", label: "Custom" },
] as const;

export function ReportFilters({
  period,
  from,
  to,
}: {
  period: string;
  from: string;
  to: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);

  function setPeriod(p: string) {
    if (p === "custom") {
      router.push(`${pathname}?period=custom&from=${customFrom}&to=${customTo}`);
    } else {
      router.push(`${pathname}?period=${p}`);
    }
  }

  function applyCustom() {
    router.push(`${pathname}?period=custom&from=${customFrom}&to=${customTo}`);
  }

  function exportFile(format: "csv" | "pdf") {
    if (format === "csv") {
      window.open(`/api/reports/export?format=csv&from=${from}&to=${to}`, "_blank");
    } else {
      window.dispatchEvent(new CustomEvent("dompetku:export-pdf"));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm border transition-colors",
              period === p.key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border bg-card hover:bg-accent"
            )}
          >
            {p.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportFile("csv")}>
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportFile("pdf")}>
            <FileText className="h-3.5 w-3.5" /> PDF
          </Button>
        </div>
      </div>

      {period === "custom" && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Dari</label>
            <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Sampai</label>
            <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
          </div>
          <Button size="sm" onClick={applyCustom}>
            Terapkan
          </Button>
        </div>
      )}
    </div>
  );
}
