import { Banknote, Receipt, TrendingUp } from "lucide-react";

import { useFeePlans } from "../hooks/useFeePlans";
import { useInstallmentPolicies } from "../hooks/useInstallmentPolicies";

export function FinancialSummaryCards() {
  const {
    data: feePlans = [],
    isLoading: isLoadingFeePlans,
  } = useFeePlans();

  const {
    data: policies = [],
    isLoading: isLoadingPolicies,
  } = useInstallmentPolicies();

  const totalExtraServices = feePlans.reduce(
    (total, plan) =>
      total + (plan.extraServices?.length || 0),
    0,
  );

  const cards = [
    {
      title: "Fee Plans",
      description: "Configured tuition structures",
      value: isLoadingFeePlans
        ? "..."
        : feePlans.length.toString(),
      icon: Receipt,
      iconStyle: "bg-primary/[0.09] text-primary",
      accentStyle: "bg-primary",
    },
    {
      title: "Extra Services",
      description: "Optional services in plans",
      value: isLoadingFeePlans
        ? "..."
        : totalExtraServices.toString(),
      icon: Banknote,
      iconStyle: "bg-info/[0.10] text-info",
      accentStyle: "bg-info",
    },
    {
      title: "Policies",
      description: "Available payment schedules",
      value: isLoadingPolicies
        ? "..."
        : policies.length.toString(),
      icon: TrendingUp,
      iconStyle: "bg-success/[0.10] text-success",
      accentStyle: "bg-success",
    },
  ];

  return (
    <section
      aria-label="Financial settings summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className={[
              "relative overflow-hidden rounded-[22px]",
              "border border-border/45 bg-card p-4",
              "shadow-[0_8px_28px_rgba(30,20,70,0.03)]",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={[
                "absolute inset-y-0 left-0 w-[3px]",
                card.accentStyle,
              ].join(" ")}
            />

            <div className="flex items-start justify-between gap-4 pl-1">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-muted-foreground">
                  {card.title}
                </p>

                <p className="mt-1 text-[25px] font-semibold leading-none tracking-[-0.025em] text-foreground">
                  {card.value}
                </p>

                <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
                  {card.description}
                </p>
              </div>

              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center",
                  "rounded-[14px]",
                  card.iconStyle,
                ].join(" ")}
              >
                <Icon size={18} strokeWidth={1.8} />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
