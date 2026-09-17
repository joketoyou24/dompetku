"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { monthName } from "@/lib/utils";

export function MonthYearSwitcher({ month, year }: { month: number; year: number }) {
  const router = useRouter();
  const pathname = usePathname();

  function go(deltaMonth: number) {
    let m = month + deltaMonth;
    let y = year;
    if (m > 12) {
      m = 1;
      y += 1;
    } else if (m < 1) {
      m = 12;
      y -= 1;
    }
    router.push(`${pathname}?month=${m}&year=${y}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 w-fit">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => go(-1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium px-2 min-w-[130px] text-center">
        {monthName(month)} {year}
      </span>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => go(1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
