import type { RecordStatus } from "../types/user.enums";

const statusClasses: Record<RecordStatus, string> = {
  active: "bg-success/10 text-success",
  draft: "bg-warning/10 text-warning",
  archived: "bg-info/10 text-info",
  deleted: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<RecordStatus, string> = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
  deleted: "Deleted",
};

export function UserStatusBadge({ status }: { status: RecordStatus }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-bold",
        statusClasses[status],
      ].join(" ")}
    >
      {statusLabels[status]}
    </span>
  );
}