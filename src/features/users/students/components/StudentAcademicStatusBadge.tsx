type StudentAcademicStatusBadgeProps = {
  status: string;
};

const statusClasses: Record<string, string> = {
  studying: "bg-info/10 text-info",
  passed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  graduated: "bg-primary/10 text-primary",
};

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StudentAcademicStatusBadge({
  status,
}: StudentAcademicStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        statusClasses[status] ?? "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {formatStatus(status)}
    </span>
  );
}