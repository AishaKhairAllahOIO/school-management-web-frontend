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
      bg: "bg-violet-500/10",
      text: "text-violet-600",
      border: "border-violet-500/15"
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      border: "border-amber-500/15"
    },
    {
      title: "Approved",
      value: approved,
      icon: CheckCircle2,
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      border: "border-emerald-500/15"
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      bg: "bg-rose-500/10",
      text: "text-rose-600",
      border: "border-rose-500/15"
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="flex items-center gap-3 rounded-[12px] border border-border/40 bg-card px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors hover:bg-muted/10"
        >
          {/* مربع الأيقونة - صغير جداً وناعم */}
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border ${card.bg} ${card.text} ${card.border}`}>
            <card.icon className="h-4 w-4" strokeWidth={2} />
          </div>
          
          {/* النصوص - خطوط أنعم وأصغر */}
          <div className="flex flex-col justify-center gap-0.5">
            <span className="text-[10.5px] font-medium text-muted-foreground/80 leading-none mt-0.5">
              {card.title}
            </span>
            <span className={`text-[15px] font-bold leading-none ${card.text}`}>
              {card.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};