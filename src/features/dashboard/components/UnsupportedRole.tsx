import { AlertCircle, ArrowLeft } from "lucide-react";

export function UnsupportedRole() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-rose-100 bg-card p-8 text-center shadow-[0_20px_60px_rgba(244,114,182,0.08)]">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-violet-100/50 blur-3xl" />

        <div className="relative">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-500 shadow-sm">
            <AlertCircle className="h-7 w-7" strokeWidth={1.7} />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-400">
            Access unavailable
          </p>

          <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
            Dashboard Not Available
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Sorry, there is no dedicated dashboard available for the
            academic role assigned to this account.
          </p>

          <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Please contact your administrator
          </div>
        </div>
      </div>
    </div>
  );
}