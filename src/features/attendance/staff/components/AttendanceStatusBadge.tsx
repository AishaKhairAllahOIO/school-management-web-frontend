interface Props {
  status: "Present" | "Absent";
}

export function AttendanceStatusBadge({ status }: Props) {
  const styles =
    status === "Present"
      ? "bg-success/[0.10] text-success"
      : "bg-destructive/[0.09] text-destructive";

  return (
    <span
      className={[
        "inline-flex rounded-full",
        "px-2.5 py-1",
        "text-[10px] font-medium",
        styles,
      ].join(" ")}
    >
      {status}
    </span>
  );
}
