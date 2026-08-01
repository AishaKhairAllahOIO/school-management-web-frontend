export function InstallmentPoliciesSkeleton() {
  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-44 animate-pulse rounded bg-muted/75" />
          <div className="h-3 w-80 max-w-full animate-pulse rounded bg-muted/50" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-xl bg-muted/65" />
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-border/60">
        <div className="grid grid-cols-4 gap-3 bg-muted/25 px-3 py-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-2.5 animate-pulse rounded bg-muted/70" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, row) => (
          <div key={row} className="grid grid-cols-4 gap-3 border-t border-border/40 px-3 py-4">
            {Array.from({ length: 4 }).map((_, cell) => (
              <div key={cell} className="h-3 animate-pulse rounded bg-muted/50" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
