import { Card } from "@/shared/ui/card";
import type { LucideIcon } from "lucide-react";

type AnalyticsMetric = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

interface Props {
  metric: AnalyticsMetric;
}

export function ReportAnalyticsCard({ metric }: Props) {
  const Icon = metric.icon;

  return (
    <Card className="rounded-[2rem] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            {metric.value}
          </h2>
        </div>

        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${metric.color}`}>
          <Icon size={22} />
        </span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{metric.description}</p>
    </Card>
  );
}
