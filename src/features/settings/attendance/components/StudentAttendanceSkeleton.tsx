export function StudentAttendanceSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-[20px] border border-border/55 bg-card p-2 shadow-[0_8px_26px_rgba(30,20,70,0.04)]">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2.5 rounded-[14px] px-3 py-2.5">
              <div className="h-8 w-8 animate-pulse rounded-[11px] bg-muted/65" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted/70" />
                <div className="h-2.5 w-4/5 animate-pulse rounded bg-muted/45" />
              </div>
            </div>
          ))}
        </aside>

        <main className="rounded-[20px] border border-border/55 bg-card p-4 shadow-[0_8px_26px_rgba(30,20,70,0.04)] sm:p-5">
          <div className="flex justify-between gap-4">
            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-muted/70" />
              <div className="h-3 w-80 max-w-full animate-pulse rounded bg-muted/45" />
            </div>
            <div className="h-11 w-28 animate-pulse rounded-[14px] bg-muted/60" />
          </div>
          <div className="mt-6 overflow-hidden rounded-[18px] border border-border/55">
            <div className="grid grid-cols-5 gap-3 bg-muted/25 px-3 py-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-2.5 animate-pulse rounded bg-muted/60" />
              ))}
            </div>
            {Array.from({ length: 4 }).map((_, row) => (
              <div key={row} className="grid grid-cols-5 gap-3 border-t border-border/40 px-3 py-4">
                {Array.from({ length: 5 }).map((_, cell) => (
                  <div key={cell} className="h-3 animate-pulse rounded bg-muted/45" />
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
