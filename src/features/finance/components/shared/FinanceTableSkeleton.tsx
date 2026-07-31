export function FinanceTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border/45 bg-card">
      <div className="grid grid-cols-6 gap-4 border-b border-border/40 bg-muted/30 px-5 py-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-3 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid grid-cols-6 items-center gap-4 border-b border-border/30 px-5 py-4 last:border-b-0">
          {Array.from({ length: 5 }).map((__, column) => (
            <div
              key={column}
              className={[
                "h-3.5 animate-pulse rounded-full bg-muted/80",
                column === 0 ? "w-4/5" : column === 4 ? "w-16" : "w-3/5",
              ].join(" ")}
            />
          ))}
          <div className="ml-auto h-9 w-9 animate-pulse rounded-full bg-muted/80" />
        </div>
      ))}
    </div>
  );
}
