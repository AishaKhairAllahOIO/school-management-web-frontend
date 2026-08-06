type StaffPageSkeletonProps = {
  mode?: "view" | "form";
};

export function StaffPageSkeleton({ mode = "view" }: StaffPageSkeletonProps) {
  return mode === "form" ? <StaffFormSkeleton /> : <StaffViewSkeleton />;
}

function StaffFormSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading staff form" className="-mt-6 animate-pulse space-y-5 pb-8">
      <div className="h-10 w-44 rounded-xl bg-muted/65" />
      <HeroSkeleton actions />

      <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <PhotoSkeleton />
        <FormSectionSkeleton fields={10} columns="md:grid-cols-2" />
      </div>

      <FormSectionSkeleton fields={2} columns="md:grid-cols-2" />
      <FormSectionSkeleton fields={6} columns="md:grid-cols-2 xl:grid-cols-3" />
    </div>
  );
}

function StaffViewSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading staff information" className="-mt-6 animate-pulse space-y-5 pb-8">
      <div className="h-10 w-44 rounded-xl bg-muted/65" />
      <HeroSkeleton />

      <div className="grid items-start gap-5 xl:grid-cols-[280px_minmax(0,1.12fr)_minmax(300px,.88fr)]">
        <PhotoSkeleton />
        <ViewSectionSkeleton fields={9} columns="sm:grid-cols-2" />
        <div className="space-y-5">
          <ViewSectionSkeleton fields={2} columns="sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2" />
          <ViewSectionSkeleton fields={6} columns="sm:grid-cols-2" />
        </div>
      </div>
    </div>
  );
}

function HeroSkeleton({ actions = false }: { actions?: boolean }) {
  return (
    <section className="rounded-[24px] border border-border/60 bg-card px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded-[16px] bg-muted/70" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-24 rounded bg-muted/70" />
            <div className="mt-3 h-7 w-56 max-w-full rounded bg-muted" />
            <div className="mt-3 h-3.5 w-full max-w-xl rounded bg-muted/70" />
          </div>
        </div>
        {actions ? (
          <div className="flex gap-2">
            <div className="h-11 w-24 rounded-xl bg-muted/70" />
            <div className="h-11 w-36 rounded-xl bg-muted" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PhotoSkeleton() {
  return (
    <section className="rounded-[22px] border border-border/70 bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-[14px] bg-muted/70" />
        <div className="flex-1">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="mt-2 h-3 w-full max-w-44 rounded bg-muted/70" />
        </div>
      </div>
      <div className="mt-4 aspect-square rounded-[18px] border border-border/60 bg-muted/20" />
    </section>
  );
}

function ViewSectionSkeleton({ fields, columns }: { fields: number; columns: string }) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card">
      <SkeletonHeader />
      <div className={["grid gap-3 p-4 sm:p-5", columns].join(" ")}>
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className={["rounded-[16px] border border-border/60 bg-card p-3.5", index === fields - 1 && fields > 6 ? "sm:col-span-2" : ""].join(" ")}>
            <div className="h-2.5 w-20 rounded bg-muted/70" />
            <div className="mt-3 h-4 w-32 max-w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}

function FormSectionSkeleton({ fields, columns }: { fields: number; columns: string }) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card">
      <SkeletonHeader />
      <div className={["grid gap-4 p-4 sm:p-5", columns].join(" ")}>
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index}>
            <div className="h-2.5 w-24 rounded bg-muted/70" />
            <div className="mt-2 h-12 rounded-[16px] border border-border/60 bg-muted/20" />
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonHeader() {
  return (
    <header className="flex items-start gap-3 border-b border-border/60 px-4 py-4 sm:px-5">
      <div className="h-10 w-10 shrink-0 rounded-[14px] bg-muted/70" />
      <div className="flex-1">
        <div className="h-2.5 w-20 rounded bg-muted/70" />
        <div className="mt-2 h-5 w-44 rounded bg-muted" />
        <div className="mt-2 h-3 w-full max-w-md rounded bg-muted/70" />
      </div>
    </header>
  );
}
