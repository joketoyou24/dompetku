export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-card">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <h1 className="text-xl font-semibold">DompetKu</h1>
          <p className="text-sm text-muted-foreground">Atur keuangan pribadimu dengan mudah</p>
        </div>
        {children}
      </div>
    </div>
  );
}
