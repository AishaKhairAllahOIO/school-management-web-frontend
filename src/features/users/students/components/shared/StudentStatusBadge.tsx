import type { EnrollmentStatus } from "../../types/student.types";

type StudentStatusBadgeProps = {
  status: EnrollmentStatus;
};

const statusStyles: Record<
  EnrollmentStatus,
  { label: string; className: string; dotClassName: string }
> = {
  enrolled: {
    label: "Enrolled",
    className: "border-success/20 bg-success/10 text-success",
    dotClassName: "bg-success",
  },
  pending: {
    label: "Pending",
    className: "border-warning/20 bg-warning/10 text-warning",
    dotClassName: "bg-warning",
  },
  suspended: {
    label: "Suspended",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    dotClassName: "bg-destructive",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "border-border bg-muted text-muted-foreground",
    dotClassName: "bg-muted-foreground",
  },
  completed: {
    label: "Completed",
    className: "border-info/20 bg-info/10 text-info",
    dotClassName: "bg-info",
  },
};

export function StudentStatusBadge({
  status,
}: StudentStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        "text-[11px] font-bold uppercase tracking-[0.08em]",
        style.className,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          style.dotClassName,
        ].join(" ")}
      />
      {style.label}
    </span>
  );
}
