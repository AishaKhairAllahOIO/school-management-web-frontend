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
      ? Math.round((presentDays / totalDays) * 100)
      : 0;

  return (
    <div className="rounded-[24px] border border-border/70 bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-[16px] font-extrabold text-foreground">
        Monthly Report
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-[16px] border border-border/60 bg-muted/30 p-4">
          <p className="text-[11.5px] font-semibold text-muted-foreground uppercase tracking-wider">Total Days</p>
          <h4 className="text-[22px] font-bold text-foreground mt-1">{totalDays}</h4>
        </div>

        <div className="rounded-[16px] border border-success/20 bg-success/[0.06] p-4">
          <p className="text-[11.5px] font-semibold text-success uppercase tracking-wider">Present Days</p>
          <h4 className="text-[22px] font-bold text-success mt-1">{presentDays}</h4>
        </div>

        <div className="rounded-[16px] border border-destructive/20 bg-destructive/[0.06] p-4">
          <p className="text-[11.5px] font-semibold text-destructive uppercase tracking-wider">Absent Days</p>
          <h4 className="text-[22px] font-bold text-destructive mt-1">{absentDays}</h4>
        </div>

        <div className="rounded-[16px] border border-primary/20 bg-primary/[0.06] p-4">
          <p className="text-[11.5px] font-semibold text-primary uppercase tracking-wider">Attendance Rate</p>
          <h4 className="text-[22px] font-bold text-primary mt-1">{rate}%</h4>
        </div>
      </div>
    </div>
  );
};