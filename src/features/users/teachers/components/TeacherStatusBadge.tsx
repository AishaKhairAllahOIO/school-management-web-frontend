import type { TeacherStatus } from "../types/teacher.types";

const statusConfig: Record<TeacherStatus, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  on_leave: "bg-warning/10 text-warning",
};

const statusLabel: Record<TeacherStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
};

export function TeacherStatusBadge({ status }: { status: TeacherStatus }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-bold",
        statusConfig[status],
      ].join(" ")}
    >
      {statusLabel[status]}
    </span>
  );
}