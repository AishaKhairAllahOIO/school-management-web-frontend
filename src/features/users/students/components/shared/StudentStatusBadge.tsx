import type { EnrollmentStatus } from "../../types/student.types";

type StudentStatusBadgeProps = {
  status: EnrollmentStatus;
};

const statusStyles: Record<
  EnrollmentStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  enrolled: {
    label: "Enrolled",
    className:
      "bg-emerald-500/[0.09] text-emerald-600",
    dotClassName: "bg-emerald-500",
  },
  suspended: {
    label: "Suspended",
    className:
      "bg-destructive/[0.08] text-destructive",
    dotClassName: "bg-destructive",
  },
  completed: {
    label: "Completed",
    className:
      "bg-primary/[0.08] text-primary",
    dotClassName: "bg-primary",
  },
};

export function StudentStatusBadge({
  status,
}: StudentStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full px-3 py-1.5",
        "text-[11px] font-medium",
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