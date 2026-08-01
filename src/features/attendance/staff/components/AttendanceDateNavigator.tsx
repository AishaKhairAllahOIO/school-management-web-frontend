import { CalendarDays } from "lucide-react";

import { Button } from "@/shared/ui/button";

type Props = { date: string; setDate: (value: string) => void };

export function AttendanceDateNavigator({ date, setDate }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  return (
    <div className="mb-2.5 flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" onClick={() => setDate(today)} className="h-9 rounded-[12px] border-primary/20 bg-background px-3 text-[11px] font-medium text-primary hover:bg-primary/[0.05]">
        Today
      </Button>
      <Button type="button" variant="outline" onClick={() => setDate(yesterday)} className="h-9 rounded-[12px] border-border/60 bg-background px-3 text-[11px] font-medium">
        Yesterday
      </Button>
      <label className="relative inline-flex h-9 items-center rounded-[12px] border border-border/60 bg-background px-3 ps-9 text-[11px] text-foreground">
        <CalendarDays className="absolute start-3 h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="bg-transparent outline-none" />
      </label>
    </div>
  );
}
