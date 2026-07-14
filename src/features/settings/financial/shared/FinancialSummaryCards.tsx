import { Banknote, Receipt, TrendingUp } from "lucide-react";

const cards = [
  { title: "Fee Plans", value: "2", icon: Receipt },
  { title: "Extra Services", value: "3", icon: Banknote },
  { title: "Policies", value: "3", icon: TrendingUp },
];

export function FinancialSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ title, value, icon: Icon }) => (
        <div key={title} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
