type StaffPageSkeletonProps = {
  mode?: "view" | "form";
};

export function StaffPageSkeleton({
  mode = "view",
}: StaffPageSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading staff information"
      className="animate-pulse space-y-5"
    >
      <section
        className={[
          "rounded-[28px]",
          "border border-border/70",
          "bg-card p-6",
          "shadow-[var(--shadow-card)]",
        ].join(" ")}
      >
        <div className="h-4 w-28 rounded-full bg-muted" />

        <div className="mt-6 flex items-center gap-4">
          <div className="h-24 w-24 shrink-0 rounded-[24px] bg-muted" />

          <div className="min-w-0 flex-1">
            <div className="h-5 w-24 rounded-full bg-muted" />

            <div className="mt-3 h-8 w-56 max-w-full rounded-lg bg-muted" />

            <div className="mt-3 h-4 w-full max-w-xl rounded bg-muted" />

            <div className="mt-2 h-4 w-2/3 max-w-md rounded bg-muted" />
          </div>
        </div>
      </section>

      {mode === "form" ? (
        <FormSectionSkeleton />
      ) : (
        <ViewSectionSkeleton />
      )}

      {mode === "form" ? (
        <FormSectionSkeleton />
      ) : (
        <ViewSectionSkeleton />
      )}

      <ViewSectionSkeleton />
    </div>
  );
}

function ViewSectionSkeleton() {
  return (
    <section
      className={[
        "overflow-hidden rounded-[26px]",
        "border border-border/70",
        "bg-card",
        "shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <SkeletonHeader />

      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className={[
              "rounded-[18px]",
              "border border-border/60",
              "bg-muted/25 p-4",
            ].join(" ")}
          >
            <div className="h-3 w-20 rounded bg-muted" />

            <div className="mt-3 h-4 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}

function FormSectionSkeleton() {
  return (
    <section
      className={[
        "overflow-hidden rounded-[26px]",
        "border border-border/70",
        "bg-card",
        "shadow-[var(--shadow-card)]",
      ].join(" ")}
    >
      <SkeletonHeader />

      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div key={index}>
            <div className="h-3 w-24 rounded bg-muted" />

            <div className="mt-2 h-12 rounded-[16px] bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonHeader() {
  return (
    <header
      className={[
        "flex items-start gap-3",
        "border-b border-border/60",
        "bg-muted/20 px-5 py-4",
      ].join(" ")}
    >
      <div className="h-11 w-11 shrink-0 rounded-[15px] bg-muted" />

      <div className="flex-1">
        <div className="h-3 w-20 rounded bg-muted" />

        <div className="mt-2 h-5 w-44 rounded bg-muted" />

        <div className="mt-2 h-3 w-full max-w-md rounded bg-muted" />
      </div>
    </header>
  );
}