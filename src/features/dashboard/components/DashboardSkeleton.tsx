import { Skeleton } from "@/shared/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[0_8px_30px_rgba(148,163,184,0.06)]"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-1.5 w-20 rounded-full" />
              </div>

              <Skeleton className="h-12 w-12 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[0_8px_30px_rgba(148,163,184,0.06)]"
          >
            <div className="mb-5 space-y-2">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-6 w-36 rounded-lg" />
            </div>

            <Skeleton className="h-60 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-[0_8px_30px_rgba(148,163,184,0.06)]"
          >
            <div className="mb-5 space-y-2">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-6 w-40 rounded-lg" />
            </div>

            <Skeleton className="h-60 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}