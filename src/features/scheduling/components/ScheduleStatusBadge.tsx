type ScheduleStatusBadgeProps = {
  status: string;
};

export function ScheduleStatusBadge({ status }: ScheduleStatusBadgeProps) {
  const isScheduled = status === "scheduled";
  const isCompleted = status === "completed";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize",
        isScheduled
          ? "bg-info/10 text-info"
          : isCompleted
            ? "bg-success/10 text-success"
            : "bg-destructive/10 text-destructive",
      ].join(" ")}
    >
      {status}
    </span>
  );
}