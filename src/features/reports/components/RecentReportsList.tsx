import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import type { RecentReport } from "../types/reports.types";

interface Props {
  reports: RecentReport[];
}

const statusClasses = {
  Ready: "rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success",
  Processing: "rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning",
  Scheduled: "rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info",
};

export function RecentReportsList({ reports }: Props) {
  return (
    <Card className="rounded-[2rem] p-6 shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent exports</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Review the most recent report deliveries and export statuses.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.title}
            className="rounded-3xl border border-border/70 bg-card p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{report.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.type} · {report.date}
                </p>
              </div>

              <span className={statusClasses[report.status]}>{report.status}</span>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">
          View all reports
        </Button>
      </CardFooter>
    </Card>
  );
}
