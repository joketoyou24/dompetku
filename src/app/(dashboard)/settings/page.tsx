import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola profil dan preferensi aplikasi.</p>
      </div>

      <ProfileForm
        name={user?.name ?? ""}
        email={user?.email ?? ""}
        image={user?.image ?? null}
        currency={user?.currency ?? "IDR"}
      />
    </div>
  );
}
