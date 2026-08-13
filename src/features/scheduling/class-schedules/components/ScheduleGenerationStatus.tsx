import {
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";

type Props = {
  isLoading: boolean;
  hasSchedule: boolean;
  scheduleId?: string;
};

export function ScheduleGenerationStatus({
  isLoading,
  hasSchedule,
  scheduleId,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground">
        <Loader2
          size={13}
          className="animate-spin"
        />
        Processing schedule...
      </div>
    );
  }

  if (hasSchedule) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
        <CheckCircle2 size={13} />
        Schedule generated
        {scheduleId ? ` · #${scheduleId}` : ""}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground">
      <Clock3 size={13} />
      No schedule generated yet
    </div>
  );
}