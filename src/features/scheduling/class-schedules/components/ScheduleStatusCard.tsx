import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

type Props = {
  isPerfect: boolean;
  entries: number;
  teacherConflicts: number;
  classConflicts: number;
  onRegenerate: () => void;
  isRegenerating: boolean;
};

export function ScheduleStatusCard({
  isPerfect,
  entries,
  teacherConflicts,
  classConflicts,
  onRegenerate,
  isRegenerating,
}: Props) {
  const hasConflicts =
    teacherConflicts > 0 ||
    classConflicts > 0;

  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]",
              isPerfect
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600",
            ].join(" ")}
          >
            {isPerfect ? (
              <CheckCircle2 size={19} />
            ) : (
              <AlertTriangle size={19} />
            )}
          </span>

          <div>
            <h2 className="text-[14px] font-semibold">
              {isPerfect
                ? "Schedule is valid"
                : "Schedule needs attention"}
            </h2>

            <p className="mt-1 text-[12px] text-muted-foreground">
              {hasConflicts
                ? `${teacherConflicts} teacher conflicts · ${classConflicts} classroom conflicts`
                : `${entries} lessons assigned successfully.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 transition hover:bg-muted/45 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={
              isRegenerating
                ? "animate-spin"
                : ""
            }
          />

          {isRegenerating
            ? "Regenerating..."
            : "Regenerate"}
        </button>
      </div>
    </section>
  );
}