export function FinanceSummarySkeleton() {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-[92px] items-center gap-3 rounded-[18px] border border-border/45 bg-card px-4 py-3.5 shadow-[0_8px_24px_rgba(38,24,84,0.03)]"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-[13px] bg-muted/65" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-24 animate-pulse rounded-full bg-muted/65" />
            <div className="mt-2 h-5 w-28 animate-pulse rounded-md bg-muted/80" />
            <div className="mt-2 h-2.5 w-32 animate-pulse rounded-full bg-muted/45" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FinanceTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border/45 bg-card shadow-[0_12px_34px_rgba(31,22,73,0.04)]">
      <div className="grid grid-cols-6 items-center gap-4 border-b border-border/40 bg-muted/20 px-5 py-2.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-3 animate-pulse rounded-full bg-muted/70" />
        ))}
        <div className="ml-auto h-8 w-8 animate-pulse rounded-[11px] border border-border/45 bg-muted/60" />
      </div>

      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="grid grid-cols-6 items-center gap-4 border-b border-border/30 px-5 py-4 last:border-b-0"
        >
          {Array.from({ length: 5 }).map((__, column) => (
            <div
              key={column}
              className={[
                "h-3.5 animate-pulse rounded-full bg-muted/75",
                column === 0 ? "w-4/5" : column === 4 ? "w-16" : "w-3/5",
              ].join(" ")}
            />
          ))}
          <div className="ml-auto flex gap-1.5">
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted/70" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted/55" />
          </div>
        </div>
      ))}
    </div>
  );
}
