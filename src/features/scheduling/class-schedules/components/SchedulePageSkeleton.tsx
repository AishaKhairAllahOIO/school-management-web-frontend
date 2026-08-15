export function SchedulePageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Page Header */}
      <section className="rounded-[24px] border border-border/45 bg-card px-4 py-3.5 shadow-[0_8px_30px_rgba(30,20,70,0.035)] sm:px-4.5 sm:py-4">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Page identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-[13px] bg-muted" />

            <div className="min-w-0">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="mt-2 h-3 w-40 rounded bg-muted" />
            </div>
          </div>

          {/* Metrics + action */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="h-8 w-[78px] rounded-[10px] bg-muted" />
            <div className="h-8 w-[112px] rounded-[10px] bg-muted" />
            <div className="h-8 w-[102px] rounded-[10px] bg-muted" />
            <div className="h-8 w-[78px] rounded-[10px] bg-muted" />

            <div className="ml-4 h-9 w-[130px] rounded-full bg-muted lg:ml-5" />
          </div>
        </div>
      </section>

      {/* Class cards */}
      <section className="space-y-3">
        {Array.from({ length: 3 }).map((_, classIndex) => {
          const colors = [
            {
              border: "border-violet-200/60",
              bg: "bg-violet-50/45",
              icon: "bg-violet-100",
            },
            {
              border: "border-sky-200/60",
              bg: "bg-sky-50/45",
              icon: "bg-sky-100",
            },
            {
              border: "border-emerald-200/60",
              bg: "bg-emerald-50/45",
              icon: "bg-emerald-100",
            },
          ];

          const color = colors[classIndex % colors.length];

          return (
            <section
              key={classIndex}
              className={[
                "overflow-hidden rounded-[26px] border bg-card",
                "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
                color.border,
              ].join(" ")}
            >
              {/* Class header */}
              <div
                className={[
                  "flex flex-col gap-3 px-4 py-4",
                  "sm:flex-row sm:items-center sm:justify-between sm:px-5",
                  color.bg,
                ].join(" ")}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={[
                      "h-10 w-10 shrink-0 rounded-[14px]",
                      color.icon,
                    ].join(" ")}
                  />

                  <div className="min-w-0">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="mt-2 h-3 w-28 rounded bg-muted" />
                  </div>
                </div>

                <div className="h-9 w-[112px] shrink-0 rounded-full bg-muted" />
              </div>

              {/* Schedule */}
              <div className="border-t border-border/40 p-3 sm:p-4">
                <div className="space-y-3">
                  {/* Toggle */}
                  <div
                    className={[
                      "flex h-[58px] items-center justify-between",
                      "rounded-[17px] border px-3.5 py-3",
                      color.border,
                      color.bg,
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-[10px] bg-muted" />

                      <div>
                        <div className="h-3 w-28 rounded bg-muted" />
                        <div className="mt-1.5 h-2.5 w-36 rounded bg-muted" />
                      </div>
                    </div>

                    <div className="h-6 w-24 rounded-full bg-muted" />
                  </div>

                  {/* Timetable */}
                  <div className="overflow-hidden rounded-[20px] border border-border/55">
                    <div className="min-w-[860px]">
                      {/* Header */}
                      <div className="grid grid-cols-6 bg-muted/[0.18]">
                        {Array.from({ length: 6 }).map(
                          (_, index) => (
                            <div
                              key={index}
                              className="h-10 border-r border-border/45 px-3 py-3 last:border-r-0"
                            >
                              <div className="mx-auto h-2.5 w-14 rounded bg-muted" />
                            </div>
                          ),
                        )}
                      </div>

                      {/* Rows */}
                      {Array.from({ length: 4 }).map(
                        (_, rowIndex) => (
                          <div
                            key={rowIndex}
                            className="grid grid-cols-6 border-t border-border/45"
                          >
                            {Array.from({ length: 6 }).map(
                              (_, cellIndex) => (
                                <div
                                  key={cellIndex}
                                  className="min-h-[112px] border-r border-border/45 p-2 last:border-r-0"
                                >
                                  {cellIndex === 0 ? (
                                    <div className="flex h-full items-center justify-center">
                                      <div className="h-3 w-16 rounded bg-muted" />
                                    </div>
                                  ) : (
                                    <div className="h-full rounded-[15px] border border-border/40 bg-muted/40 p-2.5">
                                      <div className="h-2.5 w-20 rounded bg-muted" />
                                      <div className="mt-3 h-2 w-24 rounded bg-muted" />
                                      <div className="mt-2 h-2 w-16 rounded bg-muted" />
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}