interface Props {
  status:
    | "Present"
    | "Late"
    | "Absent";
}

export const AttendanceStatusBadge =
({
  status,
}: Props) => {
  const styles = {
    Present:
      "bg-green-100 text-green-700",

    Late:
      "bg-yellow-100 text-yellow-700",

    Absent:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
};