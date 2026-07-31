export function FinancePageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="h-7 w-56 rounded-lg bg-muted/70" />
          <div className="h-4 w-96 max-w-full rounded bg-muted/55" />
        </div>
        <div className="h-11 w-44 rounded-[14px] bg-muted/65" />
      </div>
      <div className="overflow-hidden rounded-[20px] border border-border/70 bg-card">
        <div className="grid grid-cols-6 gap-4 border-b border-border/60 bg-muted/20 px-4 py-4">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-3 rounded bg-muted/70" />)}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="grid grid-cols-6 gap-4 border-b border-border/50 px-4 py-5 last:border-0">
            {Array.from({ length: 6 }).map((_, cell) => <div key={cell} className="h-4 rounded bg-muted/50" />)}
          </div>
        ))}
      </div>
    </div>
  );
}
