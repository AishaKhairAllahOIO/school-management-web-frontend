export function NotificationsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[16px] bg-topbar-soft p-3"
        >
          <div className="h-3.5 w-2/5 rounded bg-muted/70" />
          <div className="mt-2 h-3 w-full rounded bg-muted/50" />
          <div className="mt-1.5 h-3 w-4/5 rounded bg-muted/45" />
          <div className="mt-2 h-2.5 w-16 rounded bg-muted/40" />
        </div>
      ))}
    </div>
  );
}
