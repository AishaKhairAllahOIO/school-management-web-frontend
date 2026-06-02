interface Props {
  totalDays: number;
  presentDays: number;
  absentDays: number;
}

export const MonthlyAttendanceReport = ({
  totalDays,
  presentDays,
  absentDays,
}: Props) => {

  const rate =
    totalDays > 0
      ? Math.round(
          (presentDays /
            totalDays) *
            100
        )
      : 0;

  return (
    <div
      className="
        soft-card
        rounded-3xl
        p-6
      "
    >
      <h3
        className="
          mb-4
          text-lg
          font-semibold
        "
      >
        Monthly Report
      </h3>

      <div
        className="
          grid
          gap-4
          md:grid-cols-4
        "
      >
        <div>
          <p>Total Days</p>
          <h4>{totalDays}</h4>
        </div>

        <div>
          <p>Present Days</p>
          <h4>{presentDays}</h4>
        </div>

        <div>
          <p>Absent Days</p>
          <h4>{absentDays}</h4>
        </div>

        <div>
          <p>Attendance Rate</p>
          <h4>{rate}%</h4>
        </div>
      </div>
    </div>
  );
};