import {
  CalendarCheck2,
  CalendarDays,
  FileCheck2,
  FileText,
  ShieldAlert,
} from "lucide-react";

type Props = {
  total: number;
  present: number;
  absent: number;
  onLeave: number;
  partialAbsence: number;
  isLoading?: boolean;
};

function MetricSkeleton() {
  return (
    <span className="block h-6 w-10 animate-pulse rounded-[6px] bg-muted/65" />
  );
}

export function StaffAttendanceStats({
  total,
  present,
  absent,
  onLeave,
  partialAbsence,
  isLoading = false,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">

      {/* 1. Total staff */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-primary/20 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary/[0.12] text-primary">
          <FileText
            className="h-5 w-5"
            strokeWidth={2.2}
          />
        </span>

        <div className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total staff
          </span>

          {isLoading ? (
            <MetricSkeleton />
          ) : (
            <strong className="text-[20px] font-bold leading-none text-primary">
              {total}
            </strong>
          )}
        </div>
      </article>

      {/* 2. Present */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-success/20 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-success/[0.12] text-success">
          <CalendarCheck2
            className="h-5 w-5"
            strokeWidth={2.2}
          />
        </span>

        <div className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Present
          </span>

          {isLoading ? (
            <MetricSkeleton />
          ) : (
            <strong className="text-[20px] font-bold leading-none text-success">
              {present}
            </strong>
          )}
        </div>
      </article>

      {/* 3. Absent */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-destructive/25 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-destructive/[0.12] text-destructive">
          <CalendarDays
            className="h-5 w-5"
            strokeWidth={2.2}
          />
        </span>

        <div className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Absent
          </span>

          {isLoading ? (
            <MetricSkeleton />
          ) : (
            <strong className="text-[20px] font-bold leading-none text-destructive">
              {absent}
            </strong>
          )}
        </div>
      </article>

      {/* 4. On leave */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-warning/25 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-warning/[0.12] text-warning">
          <FileCheck2
            className="h-5 w-5"
            strokeWidth={2.2}
          />
        </span>

        <div className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            On leave
          </span>

          {isLoading ? (
            <MetricSkeleton />
          ) : (
            <strong className="text-[20px] font-bold leading-none text-warning">
              {onLeave}
            </strong>
          )}
        </div>
      </article>

      {/* 5. Partial absence */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-info/25 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-info/[0.12] text-info">
          <ShieldAlert
            className="h-5 w-5"
            strokeWidth={2.2}
          />
        </span>

        <div className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Partial absence
          </span>

          {isLoading ? (
            <MetricSkeleton />
          ) : (
            <strong className="text-[20px] font-bold leading-none text-info">
              {partialAbsence}
            </strong>
          )}
        </div>
      </article>

    </div>
  );
}