import {
  CalendarOff,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
} from "lucide-react";

type Props = {
  present: number;
  absent: number;
  excused: number;
  unexcused: number;
  isLoading?: boolean;
};

function MetricSkeleton({
  width = "w-12",
}: {
  width?: string;
}) {
  return (
    <span
      className={[
        "block h-6 animate-pulse rounded-[7px] bg-muted/65",
        width,
      ].join(" ")}
    />
  );
}

export function AttendanceStats({
  present,
  absent,
  excused,
  unexcused,
  isLoading = false,
}: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
      <article className="flex min-h-[116px] items-center gap-4 rounded-[20px] border border-success/15 bg-card px-5 py-4 shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-success/[0.10] text-success">
          <CheckCircle2
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </span>

        <div>
          {isLoading ? (
            <MetricSkeleton />
          ) : (
            <strong className="block text-[27px] font-semibold leading-none tracking-[-0.045em] text-success">
              {present}
            </strong>
          )}

          <span className="mt-2 block text-[12px] font-medium text-foreground">
            Present students
          </span>

          <span className="mt-0.5 block text-[11px] text-muted-foreground">
            Recorded for the selected date
          </span>
        </div>
      </article>

      <article className="overflow-hidden rounded-[20px] border border-destructive/15 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.04)]">
        <div className="flex min-h-[66px] items-center gap-3 border-b border-border/50 px-5 py-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-destructive/[0.09] text-destructive">
            <CalendarOff
              className="h-[18px] w-[18px]"
              strokeWidth={1.8}
            />
          </span>

          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-medium text-muted-foreground">
              Total absences
            </span>

            {isLoading ? (
              <div className="mt-1">
                <MetricSkeleton width="w-10" />
              </div>
            ) : (
              <strong className="mt-1 block text-[25px] font-semibold leading-none tracking-[-0.04em] text-destructive">
                {absent}
              </strong>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border/55 rtl:divide-x-reverse">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-info/[0.10] text-info">
              <FileCheck2
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </span>

            <div>
              {isLoading ? (
                <MetricSkeleton width="w-8" />
              ) : (
                <strong className="block text-[20px] font-semibold leading-none text-info">
                  {excused}
                </strong>
              )}

              <span className="mt-1 block text-[11px] text-muted-foreground">
                Excused
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-warning/[0.11] text-warning">
              <ShieldAlert className="h-4 w-4" />
            </span>

            <div>
              {isLoading ? (
                <MetricSkeleton width="w-8" />
              ) : (
                <strong className="block text-[20px] font-semibold leading-none text-warning">
                  {unexcused}
                </strong>
              )}

              <span className="mt-1 block text-[11px] text-muted-foreground">
                Unexcused
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}