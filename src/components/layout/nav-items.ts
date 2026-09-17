import { LayoutDashboard, ArrowLeftRight, PiggyBank, Target, FileBarChart, Settings, Tags } from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { href: "/budget", label: "Anggaran", icon: PiggyBank },
  { href: "/savings", label: "Tabungan", icon: Target },
  { href: "/reports", label: "Laporan", icon: FileBarChart },
  { href: "/categories", label: "Kategori", icon: Tags },
  { href: "/settings", label: "Profil", icon: Settings },
];

// subset untuk bottom navigation mobile (maksimal 5 agar tidak sempit)
export const mobileNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { href: "/budget", label: "Anggaran", icon: PiggyBank },
  { href: "/savings", label: "Tabungan", icon: Target },
  { href: "/settings", label: "Profil", icon: Settings },
];
