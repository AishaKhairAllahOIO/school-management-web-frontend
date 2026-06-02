interface Props {
  total: number;
  present: number;
  absent: number;
  excused: number;
  unexcused: number;
}

export const AttendanceStats = ({
  total,
  present,
  absent,
  excused,
  unexcused,
}: Props) => {
  return (
    <div
      className="
        grid
        gap-4
        md:grid-cols-5
      "
    >
      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <h3 className="text-muted-foreground">
          Total Students
        </h3>

        <p className="text-3xl font-bold">
          {total}
        </p>
      </div>

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <h3 className="text-muted-foreground">
          Present
        </h3>

        <p
          className="
            text-3xl
            font-bold
            text-green-600
          "
        >
          {present}
        </p>
      </div>

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <h3 className="text-muted-foreground">
          Absent
        </h3>

        <p
          className="
            text-3xl
            font-bold
            text-red-500
          "
        >
          {absent}
        </p>
      </div>

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <h3 className="text-muted-foreground">
          Excused
        </h3>

        <p
          className="
            text-3xl
            font-bold
            text-blue-600
          "
        >
          {excused}
        </p>
      </div>

      <div
        className="
          soft-card
          rounded-3xl
          p-5
        "
      >
        <h3 className="text-muted-foreground">
          Unexcused
        </h3>

        <p
          className="
            text-3xl
            font-bold
            text-orange-500
          "
        >
          {unexcused}
        </p>
      </div>
    </div>
  );
};