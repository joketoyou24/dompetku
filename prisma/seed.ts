import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Kategori default (global, userId = null) — muncul untuk semua user.
const defaultCategories = [
  // Pemasukan
  { name: "Gaji", type: "INCOME", icon: "Wallet", color: "#10B981" },
  { name: "Freelance", type: "INCOME", icon: "Laptop", color: "#059669" },
  { name: "Bonus", type: "INCOME", icon: "Gift", color: "#34D399" },
  { name: "Investasi", type: "INCOME", icon: "TrendingUp", color: "#06B6D4" },
  // Pengeluaran
  { name: "Makanan", type: "EXPENSE", icon: "UtensilsCrossed", color: "#F59E0B" },
  { name: "Transport", type: "EXPENSE", icon: "Car", color: "#3B82F6" },
  { name: "Belanja", type: "EXPENSE", icon: "ShoppingBag", color: "#EC4899" },
  { name: "Tagihan", type: "EXPENSE", icon: "FileText", color: "#8B5CF6" },
  { name: "Hiburan", type: "EXPENSE", icon: "Clapperboard", color: "#EF4444" },
  { name: "Kesehatan", type: "EXPENSE", icon: "HeartPulse", color: "#14B8A6" },
  { name: "Pendidikan", type: "EXPENSE", icon: "GraduationCap", color: "#6366F1" },
  { name: "Lainnya", type: "EXPENSE", icon: "MoreHorizontal", color: "#6B7280" },
];

async function main() {
  console.log("Seeding kategori default...");

  for (const cat of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, isDefault: true, userId: null },
    });
    if (!existing) {
      await prisma.category.create({
        data: { ...cat, isDefault: true, userId: null },
      });
      console.log(`  + ${cat.name}`);
    }
  }

  console.log("Selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
