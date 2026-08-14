import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import type { ScheduleQualityReport as Report } from "../types/schedule.types";

type Props = {
  isPerfect: boolean;
  report: Report;
};

export function ScheduleQualityReport({
  isPerfect,
  report,
}: Props) {
  const violations = report.violations ?? [];

  return (
    <section className="rounded-[22px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]",
              isPerfect
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            ].join(" ")}
          >
            {isPerfect ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
          </span>

          <div>
            <h2 className="text-[14px] font-semibold text-foreground">
              Schedule Quality
            </h2>

            <p className="mt-1 text-[12px] text-muted-foreground">
              {isPerfect
                ? "No scheduling conflicts were detected."
                : "The generated schedule contains some validation issues."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <ReportBadge
            label="Entries"
            value={report.statistics.entries}
          />

          <ReportBadge
            label="Teacher conflicts"
            value={report.statistics.teacher_conflicts}
          />

          <ReportBadge
            label="Class conflicts"
            value={report.statistics.class_conflicts}
          />
        </div>
      </div>

      {violations.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border/45 pt-4">
          {violations.map((violation, index) => (
            <div
              key={index}
              className="rounded-[14px] border border-amber-200/60 bg-amber-50/50 p-3"
            >
              <p className="text-[12px] font-medium text-amber-900">
                {getViolationTitle(violation)}
              </p>

              {(violation.grade_name ||
                violation.class_room_name) && (
                <p className="mt-1 text-[11px] text-amber-800/75">
                  {[
                    violation.grade_name,
                    violation.class_room_name,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              <p className="mt-1 break-words text-[10px] text-amber-800/65">
                {getViolationDescription(violation)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ReportBadge({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <span className="rounded-full border border-border/55 bg-background px-3 py-1.5 text-[10px] text-muted-foreground">
      {label}:{" "}
      <strong className="font-semibold text-foreground">
        {value}
      </strong>
    </span>
  );
}

function getViolationTitle(
  violation: Record<string, unknown>,
) {
  const type =
    violation.type ??
    violation.rule ??
    violation.message ??
    "Schedule validation issue";

  return String(type);
}

function getViolationDescription(
  violation: Record<string, unknown>,
) {
  if (typeof violation.message === "string") {
    return violation.message;
  }

  const ignored = new Set([
    "type",
    "rule",
    "message",
    "class",
    "class_room_id",
    "grade_name",
    "class_room_name",
  ]);

  const values = Object.entries(violation)
    .filter(([key]) => !ignored.has(key))
    .map(([key, value]) => `${key}: ${String(value)}`);

  return values.length > 0
    ? values.join(" · ")
    : "Please review this validation issue.";
}