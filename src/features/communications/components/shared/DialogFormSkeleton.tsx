type DialogFormSkeletonProps = {
  rows?: number;
};

export function DialogFormSkeleton({
  rows = 5,
}: DialogFormSkeletonProps) {
  return (
    <div className="space-y-4" aria-label="Loading form">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={[
              "space-y-2",
              index === rows - 1 && rows % 2 === 1
                ? "sm:col-span-2"
                : "",
            ].join(" ")}
          >
            <div className="h-3 w-24 animate-pulse rounded-full bg-muted/65" />
            <div className="h-11 animate-pulse rounded-[13px] border border-border/45 bg-muted/35" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-3 w-28 animate-pulse rounded-full bg-muted/65" />
        <div className="h-28 animate-pulse rounded-[14px] border border-border/45 bg-muted/35" />
      </div>

      <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
        <div className="h-10 w-24 animate-pulse rounded-[12px] bg-muted/45" />
        <div className="h-10 w-32 animate-pulse rounded-[12px] bg-muted/65" />
      </div>
    </div>
  );
}
