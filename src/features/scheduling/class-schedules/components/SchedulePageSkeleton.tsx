export function SchedulePageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-[105px] rounded-[22px] border border-border/45 bg-card"
            />
          ),
        )}
      </div>

      <div className="rounded-[26px] border border-border/45 bg-card p-5">
        <div className="h-5 w-48 rounded bg-muted" />
        <div className="mt-3 h-4 w-72 rounded bg-muted" />
      </div>

      <div className="overflow-hidden rounded-[26px] border border-border/45 bg-card">
        <div className="grid grid-cols-6 gap-px bg-border/30">
          {Array.from({ length: 30 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 bg-card"
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}