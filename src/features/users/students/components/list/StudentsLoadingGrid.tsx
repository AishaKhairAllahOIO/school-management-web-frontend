const heights = [
  "h-[31rem]",
  "h-[35rem]",
  "h-[33rem]",
  "h-[37rem]",
];

export function StudentsLoadingGrid() {
  return (
    <section
      aria-label="Loading students"
      className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4"
    >
      {Array.from({
        length: 10,
      }).map((_, index) => (
        <div
          key={index}
          className={[
            "mb-5 break-inside-avoid",
            "overflow-hidden rounded-[24px]",
            "border border-border/60",
            "bg-card",
            "shadow-[0_10px_35px_rgba(30,20,70,0.05)]",
            heights[
              index % heights.length
            ],
          ].join(" ")}
        >
          <div className="h-[54%] animate-pulse bg-muted/70" />

          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />

              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="h-12 animate-pulse rounded-[14px] bg-muted/65" />

              <div className="h-12 animate-pulse rounded-[14px] bg-muted/65" />

              <div className="h-12 animate-pulse rounded-[14px] bg-muted/65" />
            </div>

            <div className="h-10 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </section>
  );
}