import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { AuthSessionProvider } from "@/components/session-provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AuthSessionProvider>
      <div className="min-h-screen bg-muted/40">
        <Sidebar />
        <div className="md:pl-64 flex flex-col min-h-screen">
          <Topbar userName={session.user.name} userEmail={session.user.email} userImage={session.user.image} />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">{children}</main>
        </div>
        <BottomNav />
      </div>
    </AuthSessionProvider>
  );
}
