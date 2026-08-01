type ScheduleStatusBadgeProps = {
  status: string;
};

export function ScheduleStatusBadge({ status }: ScheduleStatusBadgeProps) {
  const isScheduled = status === "scheduled" || status === "upcoming";
  const isCompleted = status === "completed";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium capitalize",
        isScheduled
          ? "bg-sky-50 text-sky-700"
          : isCompleted
            ? "bg-emerald-50 text-emerald-700"
            : "bg-rose-50 text-rose-700",
      ].join(" ")}
    >
      {status}
    </span>
  );
}
