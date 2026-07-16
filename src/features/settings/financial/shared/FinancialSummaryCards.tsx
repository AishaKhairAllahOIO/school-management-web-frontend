import { Banknote, Receipt, TrendingUp } from "lucide-react";

import { useFeePlans } from "../hooks/useFeePlans";
import { useInstallmentPolicies } from "../hooks/useInstallmentPolicies";


export function FinancialSummaryCards() {
  const { data: feePlans = [], isLoading: isLoadingFeePlans } = useFeePlans();
  const { data: policies = [], isLoading: isLoadingPolicies } = useInstallmentPolicies();


  const totalExtraServices = feePlans.reduce(
    (total, plan) => total + (plan.extraServices?.length || 0), 
    0
  );

  const cards = [
    { 
      title: "Fee Plans", 
      value: isLoadingFeePlans ? "..." : feePlans.length.toString(), 
      icon: Receipt 
    },
    { 
      title: "Extra Services", 

      value: isLoadingFeePlans ? "..." : totalExtraServices.toString(), 
      icon: Banknote 
    },
    { 
      title: "Policies", 
      value: isLoadingPolicies ? "..." : policies.length.toString(), 
      icon: TrendingUp 
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ title, value, icon: Icon }) => (
        <div key={title} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
            <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}