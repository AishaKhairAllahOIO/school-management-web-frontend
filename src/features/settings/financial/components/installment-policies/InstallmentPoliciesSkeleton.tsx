import { Skeleton } from "@/shared/ui/skeleton";

export function InstallmentPoliciesSkeleton() {
  return (
    <div className="rounded-2xl border shadow-sm">
      <div className="space-y-4 p-6">

        <Skeleton className="h-10 w-52" />

        <Skeleton className="h-12 w-full" />

        <Skeleton className="h-12 w-full" />

        <Skeleton className="h-12 w-full" />

      </div>
    </div>
  );
}