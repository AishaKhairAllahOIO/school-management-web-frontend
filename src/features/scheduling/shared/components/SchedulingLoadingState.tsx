export function SchedulingLoadingState() {
  return (
    <div className="space-y-5" aria-label="Loading schedules">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-[22px] border border-border/40 bg-card"
          />
        ))}
      </div>

      <div className="rounded-[26px] border border-border/45 bg-card p-5">
        <div className="h-10 w-64 animate-pulse rounded-[14px] bg-muted/45" />
        <div className="mt-5 grid gap-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-3">
              <div className="h-12 animate-pulse rounded-[16px] bg-muted/35" />
              {[0, 1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="h-24 animate-pulse rounded-[18px] bg-muted/25"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
