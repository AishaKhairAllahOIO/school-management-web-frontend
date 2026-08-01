import {
  AlertTriangle,
  LayoutDashboard,
  Loader2,
} from "lucide-react";

export function DashboardLoadingState() {
  return (
    <section className="flex min-h-[360px] items-center justify-center rounded-[26px] border border-border/45 bg-card p-8 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary/[0.08] text-primary">
          <Loader2 className="animate-spin" size={21} />
        </span>
        <p className="mt-4 text-[13px] font-medium text-foreground">Preparing dashboard</p>
        <p className="mt-1 text-[10px] text-muted-foreground">Reading the signed-in user role.</p>
      </div>
    </section>
  );
}

export function UnsupportedDashboardRole({ rawRole }: { rawRole: string | null }) {
  return (
    <section className="flex min-h-[360px] items-center justify-center rounded-[26px] border border-border/45 bg-card p-8 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-warning/[0.09] text-warning">
          {rawRole ? <AlertTriangle size={21} /> : <LayoutDashboard size={21} />}
        </span>
        <h2 className="mt-4 text-[15px] font-semibold text-foreground">Dashboard unavailable</h2>
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          {rawRole
            ? `The role “${rawRole}” does not have a dashboard mapping yet.`
            : "The signed-in user role could not be resolved."}
        </p>
      </div>
    </section>
  );
}
