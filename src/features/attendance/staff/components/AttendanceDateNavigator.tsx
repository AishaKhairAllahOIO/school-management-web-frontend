import { CalendarDays } from "lucide-react";
import { Button } from "@/shared/ui/button";

type Props = { date: string; setDate: (value: string) => void };

export function AttendanceDateNavigator({ date, setDate }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2.5">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setDate(today)} 
        className="h-10 rounded-[12px] border-primary/30 bg-card px-3.5 text-[12px] font-semibold text-primary hover:bg-primary/10 transition-colors shadow-xs"
      >
        Today
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setDate(yesterday)} 
        className="h-10 rounded-[12px] border-border/70 bg-card px-3.5 text-[12px] font-medium text-foreground hover:bg-muted/40 transition-colors shadow-xs"
      >
        Yesterday
      </Button>
      <label className="relative inline-flex h-10 items-center rounded-[12px] border border-border/70 bg-card px-3.5 ps-9 text-[12px] text-foreground shadow-xs cursor-pointer">
        <CalendarDays className="absolute start-3 h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
        <input 
          type="date" 
          value={date} 
          onChange={(event) => setDate(event.target.value)} 
          className="bg-transparent text-foreground outline-none cursor-pointer" 
        />
      </label>
    </div>
  );
}