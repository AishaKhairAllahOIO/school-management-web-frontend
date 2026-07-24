export function StudentsLoadingGrid() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading students"
      className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
    >
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <article
          key={index}
          className={[
            "relative flex min-h-[365px] flex-col overflow-hidden",
            "rounded-[24px] border",
            "border-primary/20 bg-card",
            "shadow-[var(--shadow-card)]",
          ].join(" ")}
        >
          <div className="absolute inset-x-0 top-0 h-[3px] animate-pulse bg-primary/25" />

          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3.5">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-[18px] bg-muted" />

                <div className="min-w-0 flex-1">
                  <div className="h-5 w-2/3 animate-pulse rounded-md bg-muted" />

                  <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded bg-muted/70" />
                </div>
              </div>

              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted/70" />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />

              <div className="h-6 w-28 animate-pulse rounded-full bg-muted/70" />
            </div>

            <div className="mt-5 grid gap-2.5">
              {Array.from({
                length: 4,
              }).map((__, rowIndex) => (
                <div
                  key={rowIndex}
                  className={[
                    "flex min-w-0 items-center gap-3",
                    "rounded-2xl border",
                    "border-border/55",
                    "bg-muted/25",
                    "px-3 py-2.5",
                  ].join(" ")}
                >
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-xl bg-muted" />

                  <div className="min-w-0 flex-1">
                    <div className="h-2.5 w-16 animate-pulse rounded bg-muted/75" />

                    <div className="mt-2 h-3.5 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={[
              "grid grid-cols-[1fr_auto_auto_auto]",
              "items-center gap-2",
              "border-t border-primary/15",
              "bg-primary/[0.025]",
              "px-4 py-3",
            ].join(" ")}
          >
            <div className="h-10 animate-pulse rounded-xl bg-muted/70" />

            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />

            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />

            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
          </div>
        </article>
      ))}
    </section>
  );
}