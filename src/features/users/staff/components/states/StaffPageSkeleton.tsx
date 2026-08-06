type StaffPageSkeletonProps = {
  mode?: "view" | "form";
};

export function StaffPageSkeleton({ mode = "view" }: StaffPageSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading staff information" className="animate-pulse space-y-4">
      <section className="rounded-[22px] border border-border/70 bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="h-3 w-24 rounded-full bg-muted" />
        <div className="mt-4 flex items-center gap-3.5">
          <div className="h-16 w-16 shrink-0 rounded-[18px] bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="mt-2.5 h-6 w-52 max-w-full rounded-md bg-muted" />
            <div className="mt-2.5 h-3.5 w-full max-w-lg rounded bg-muted/80" />
          </div>
        </div>
      </section>
      {mode === "form" ? <FormSectionSkeleton /> : <ViewSectionSkeleton />}
      {mode === "form" ? <FormSectionSkeleton /> : <ViewSectionSkeleton />}
      <ViewSectionSkeleton />
    </div>
  );
}

function ViewSectionSkeleton() {
  return (
    <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
      <SkeletonHeader />
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[16px] border border-border/60 bg-card p-3.5">
            <div className="h-2.5 w-20 rounded bg-muted" />
            <div className="mt-2.5 h-3.5 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}

function FormSectionSkeleton() {
  return (
    <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[var(--shadow-card)]">
      <SkeletonHeader />
      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="h-2.5 w-24 rounded bg-muted" />
            <div className="mt-2 h-10 rounded-xl bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonHeader() {
  return (
    <header className="flex items-start gap-3 border-b border-border/60 bg-card px-4 py-3.5 sm:px-5">
      <div className="h-9 w-9 shrink-0 rounded-xl bg-muted" />
      <div className="flex-1">
        <div className="h-2.5 w-20 rounded bg-muted" />
        <div className="mt-2 h-4 w-44 rounded bg-muted" />
        <div className="mt-2 h-3 w-full max-w-md rounded bg-muted/80" />
      </div>
    </header>
  );
}
