import type {
  StaffAttendanceReportResponse,
} from "../types/reports.types";

export function StaffAttendanceDetails({
  report,
}: {
  report: StaffAttendanceReportResponse | null;
}) {
  if (!report) {
    return (
      <section className="rounded-[22px] border border-border/60 bg-card p-5">
        <p className="text-[12px] text-muted-foreground">
          Staff attendance data is currently unavailable.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[22px] border border-border/60 bg-card">
      <header className="border-b border-border/45 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-foreground">
          Missed periods by subject
        </h2>

        <p className="mt-1 text-[11px] text-muted-foreground">
          Breakdown of missed teaching periods by subject.
        </p>
      </header>

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryItem
          label="Unexcused days"
          value={report.total_unexcused_days}
        />

        <SummaryItem
          label="Excused days"
          value={report.total_excused_days}
        />

        <SummaryItem
          label="Leave days"
          value={report.total_leave_days}
        />

        <SummaryItem
          label="Missed periods"
          value={report.total_missed_periods_count}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-start">
          <thead>
            <tr className="border-y border-border/45 bg-muted/20">
              <th className="px-5 py-3 text-start text-[10px] font-semibold text-muted-foreground">
                Subject
              </th>

              <th className="px-5 py-3 text-end text-[10px] font-semibold text-muted-foreground">
                Missed periods
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/40">
            {report.missed_periods_by_subject.map(
              (subject) => (
                <tr
                  key={subject.subject_name}
                  className="transition-colors hover:bg-muted/15"
                >
                  <td className="px-5 py-3.5 text-[11px] font-medium text-foreground">
                    {subject.subject_name}
                  </td>

                  <td className="px-5 py-3.5 text-end text-[11px] font-semibold text-foreground">
                    {subject.missed_periods_count}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[15px] border border-border/50 bg-muted/15 p-3.5">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <strong className="mt-1 block text-[18px] font-semibold tracking-[-0.03em] text-foreground">
        {value}
      </strong>
    </div>
  );
}