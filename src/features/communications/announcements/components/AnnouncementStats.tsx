interface Props {
  total: number;
  active: number;
  highPriority: number;
  todayCount: number;
}

export const AnnouncementStats = ({
  total,
  active,
  highPriority,
  todayCount,
}: Props) => {
  return (
    <div
      className="
        grid
        gap-4
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <p className="text-sm text-muted-foreground">
          Total Announcements
        </p>

        <h3
          className="
            mt-2
            text-3xl
            font-bold
          "
        >
          {total}
        </h3>
      </div>

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <p className="text-sm text-muted-foreground">
          Active
        </p>

        <h3
          className="
            mt-2
            text-3xl
            font-bold
            text-primary
          "
        >
          {active}
        </h3>
      </div>

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <p className="text-sm text-muted-foreground">
          High Priority
        </p>

        <h3
          className="
            mt-2
            text-3xl
            font-bold
            text-red-500
          "
        >
          {highPriority}
        </h3>
      </div>

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <p className="text-sm text-muted-foreground">
          Published Today
        </p>

        <h3
          className="
            mt-2
            text-3xl
            font-bold
            text-green-600
          "
        >
          {todayCount}
        </h3>
      </div>
    </div>
  );
};