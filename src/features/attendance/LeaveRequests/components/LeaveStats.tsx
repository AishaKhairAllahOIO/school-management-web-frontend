import { CalendarDays, Clock3, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const LeaveStats = ({ total, pending, approved, rejected }: Props) => {
  const cards = [
    {
      title: "Total Requests",
      value: total,
      icon: CalendarDays,
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/25"
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      bg: "bg-warning/10",
      text: "text-warning",
      border: "border-warning/25"
    },
    {
      title: "Approved",
      value: approved,
      icon: CheckCircle2,
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/25"
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      bg: "bg-destructive/10",
      text: "text-destructive",
      border: "border-destructive/25"
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="flex items-center gap-3.5 rounded-[18px] border border-border/70 bg-card px-4 py-3.5 shadow-sm transition-all hover:shadow-md"
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border ${card.bg} ${card.text} ${card.border}`}>
            <card.icon className="h-5 w-5" strokeWidth={2.2} />
          </div>
          
          <div className="flex flex-col justify-center gap-0.5 min-w-0">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
              {card.title}
            </span>
            <span className={`text-[20px] font-bold leading-none ${card.text}`}>
              {card.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};