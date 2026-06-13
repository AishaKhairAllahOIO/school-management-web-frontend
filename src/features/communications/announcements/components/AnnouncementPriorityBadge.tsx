interface Props {
  priority:
    | "Low"
    | "Medium"
    | "High";
}

export const AnnouncementPriorityBadge = ({
  priority,
}: Props) => {

  if (priority === "High") {
    return (
      <span
        className="
          rounded-full
          bg-red-100
          px-3
          py-1
          text-xs
          font-medium
          text-red-700
        "
      >
        High
      </span>
    );
  }

  if (priority === "Medium") {
    return (
      <span
        className="
          rounded-full
          bg-orange-100
          px-3
          py-1
          text-xs
          font-medium
          text-orange-700
        "
      >
        Medium
      </span>
    );
  }

  return (
    <span
      className="
        rounded-full
        bg-muted
        px-3
        py-1
        text-xs
        font-medium
      "
    >
      Low
    </span>
  );
};