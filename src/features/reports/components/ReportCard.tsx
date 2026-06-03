import { Button } from "@/shared/ui/button";
import { Card, CardFooter } from "@/shared/ui/card";
import type { ReportCardInfo } from "../types/reports.types";

interface Props {
  report: ReportCardInfo;
}

export function ReportCard({ report }: Props) {
  const Icon = report.icon;

  return (
    <Card className="rounded-[2rem] p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{report.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{report.description}</p>
        </div>

        <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Icon size={20} />
        </span>
      </div>

      <CardFooter className="mt-6 rounded-[1.5rem] border border-border/70 bg-background p-4">
        <Button size="sm" variant="outline">
          {report.action}
        </Button>
      </CardFooter>
    </Card>
  );
}
