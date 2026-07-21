const heights = ["h-80", "h-[27rem]", "h-96", "h-[31rem]", "h-[26rem]", "h-[29rem]", "h-96", "h-[28rem]"];

export function StudentsLoadingGrid() {
  return (
    <section aria-label="Loading students" className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className={[
            "mb-5 break-inside-avoid overflow-hidden rounded-[30px]",
            "border border-border/70 bg-card shadow-[var(--shadow-card)]",
            heights[index % heights.length],
          ].join(" ")}
        >
          <div className="h-[55%] animate-pulse bg-muted" />
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="h-5 w-28 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
            <div className="space-y-2.5">
              <div className="h-14 animate-pulse rounded-2xl bg-muted/80" />
              <div className="h-14 animate-pulse rounded-2xl bg-muted/80" />
            </div>
            <div className="h-11 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      ))}
    </section>
  );
}
