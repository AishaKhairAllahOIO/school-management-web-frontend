import type {
  StudentAttendanceReportResponse,
} from "../types/reports.types";

export function StudentAttendanceDetails({
  report,
}: {
  report: StudentAttendanceReportResponse | null;
}) {
  if (!report) {
    return (
      <section className="rounded-[22px] border border-border/60 bg-card p-5">
        <p className="text-[12px] text-muted-foreground">
          Student attendance data is currently unavailable.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[22px] border border-border/60 bg-card">
      <header className="border-b border-border/45 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-foreground">
          Classroom attendance
        </h2>

        <p className="mt-1 text-[11px] text-muted-foreground">
          Attendance and absence breakdown by classroom.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-start">
          <thead>
            <tr className="border-b border-border/45 bg-muted/20">
              <th className="px-5 py-3 text-start text-[10px] font-semibold text-muted-foreground">
                Classroom
              </th>

              <th className="px-4 py-3 text-start text-[10px] font-semibold text-muted-foreground">
                Students
              </th>

              <th className="px-4 py-3 text-start text-[10px] font-semibold text-muted-foreground">
                Attendance
              </th>

              <th className="px-4 py-3 text-start text-[10px] font-semibold text-muted-foreground">
                Absence
              </th>

              <th className="px-4 py-3 text-start text-[10px] font-semibold text-muted-foreground">
                Unexcused
              </th>

              <th className="px-4 py-3 text-start text-[10px] font-semibold text-muted-foreground">
                Excused
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/40">
            {report.classrooms_summary.map((classroom) => (
              <tr
                key={classroom.class_room_id}
                className="transition-colors hover:bg-muted/15"
              >
                <td className="px-5 py-3.5 text-[11px] font-medium text-foreground">
                  {classroom.class_room_name}
                </td>

                <td className="px-4 py-3.5 text-[11px] text-muted-foreground">
                  {classroom.student_count}
                </td>

                <td className="px-4 py-3.5 text-[11px] font-semibold text-success">
                  {classroom.attendance_rate}%
                </td>

                <td className="px-4 py-3.5 text-[11px] text-muted-foreground">
                  {classroom.absence_rate}%
                </td>

                <td className="px-4 py-3.5 text-[11px] text-destructive">
                  {classroom.unexcused_absences}
                </td>

                <td className="px-4 py-3.5 text-[11px] text-muted-foreground">
                  {classroom.excused_absences}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}