import { EyeOff, KeyRound, ShieldCheck } from "lucide-react";

export function SecurityCard() {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Change Password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your account secure by using a strong password.
          </p>
        </div>

        <span className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex">
          <ShieldCheck size={20} />
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {["Current Password", "New Password", "Confirm Password"].map((label) => (
          <label key={label} className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground">{label}</span>

            <div className="flex h-11 items-center gap-2 rounded-2xl bg-background px-3 ring-1 ring-border/60">
              <KeyRound size={15} className="text-muted-foreground" />

              <input
                type="password"
                placeholder="••••••••"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />

              <EyeOff size={15} className="text-muted-foreground" />
            </div>
          </label>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
          Save Password
        </button>
      </div>
    </section>
  );
}