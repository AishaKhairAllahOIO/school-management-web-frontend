type TeacherStatusBadgeProps = {
  status: string;
};

export function TeacherStatusBadge({ status }: TeacherStatusBadgeProps) {
  const isActive = status === "active" || status === "enabled";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        isActive
          ? "bg-success/10 text-success"
          : "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-success" : "bg-muted-foreground",
        ].join(" ")}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}