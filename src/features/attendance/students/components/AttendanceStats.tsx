import {
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
  CalendarOff,
} from "lucide-react";

type Props = {
  present: number;
  absent: number;
  excused: number;
  unexcused: number;
  isLoading?: boolean;
};

function MetricSkeleton() {
  return <span className="block h-6 w-10 animate-pulse rounded-[6px] bg-muted/65" />;
}

export function AttendanceStats({ present, absent, excused, unexcused, isLoading = false }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. الحاضرون */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-success/20 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-success/[0.12] text-success">
          <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Present</span>
          {isLoading ? <MetricSkeleton /> : <strong className="text-[20px] font-bold text-success leading-none">{present}</strong>}
        </div>
      </article>

      {/* 2. إجمالي الغياب */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-destructive/25 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-destructive/[0.12] text-destructive">
          <CalendarOff className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Absences</span>
          {isLoading ? <MetricSkeleton /> : <strong className="text-[20px] font-bold text-destructive leading-none">{absent}</strong>}
        </div>
      </article>

      {/* 3. بعذر */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-info/25 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-info/[0.12] text-info">
          <FileCheck2 className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Excused</span>
          {isLoading ? <MetricSkeleton /> : <strong className="text-[20px] font-bold text-info leading-none">{excused}</strong>}
        </div>
      </article>

      {/* 4. بدون عذر */}
      <article className="flex items-center gap-3.5 rounded-[18px] border border-warning/25 bg-card px-4 py-3 shadow-[0_2px_10px_rgba(30,20,70,0.02)] transition-all hover:shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-warning/[0.12] text-warning">
          <ShieldAlert className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Unexcused</span>
          {isLoading ? <MetricSkeleton /> : <strong className="text-[20px] font-bold text-warning leading-none">{unexcused}</strong>}
        </div>
      </article>
    </div>
  );
}