import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SavingsBoard } from "@/components/savings/savings-board";
import type { SavingGoalDTO } from "@/types";

export default async function SavingsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [user, goals] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.savingGoal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Target Tabungan</h1>
        <p className="text-sm text-muted-foreground">Wujudkan tujuan keuanganmu selangkah demi selangkah.</p>
      </div>

      <SavingsBoard
        goals={goals.map((g) => ({ ...g, deadline: g.deadline?.toISOString() ?? null })) as unknown as SavingGoalDTO[]}
        currency={user?.currency ?? "IDR"}
      />
    </div>
  );
}
