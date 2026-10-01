import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/logo-full.png"
            alt="DompetKu — Kelola Keuangan Anda Dengan Mudah"
            width={260}
            height={198}
            className="object-contain"
            priority
          />
        </div>
        {children}
      </div>
    </div>
  );
}
