import { ReceiptText } from "lucide-react";

import type { FeePlan } from "../../types/feePlan.types";
import { FinancialActionMenu } from "../../shared/FinancialActionMenu";
import {
  FinancialEntityTable,
  FinancialEntityTd,
  FinancialEntityTh,
} from "../../shared/FinancialEntityTable";

type Props = {
  feePlans: FeePlan[];
  onEdit: (plan: FeePlan) => void;
  onDelete: (plan: FeePlan) => void;
};

export function FeePlansTable({ feePlans, onEdit, onDelete }: Props) {
  if (!feePlans.length) {
    return (
      <div className="mt-4 rounded-[18px] border border-dashed border-border bg-muted/15 p-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-[13px] bg-primary/[0.08] text-primary">
          <ReceiptText size={18} strokeWidth={1.8} />
        </span>
        <p className="mt-3 text-[15px] font-medium text-foreground">No fee plans yet</p>
        <p className="mt-1 text-[13px] font-normal text-muted-foreground">
          Create the first tuition plan to begin configuring school finances.
        </p>
      </div>
    );
  }

  return (
    <FinancialEntityTable>
      <thead>
        <tr>
          <FinancialEntityTh>Name</FinancialEntityTh>
          <FinancialEntityTh>Academic Year</FinancialEntityTh>
          <FinancialEntityTh>Grade</FinancialEntityTh>
          <FinancialEntityTh>Base Amount</FinancialEntityTh>
          <FinancialEntityTh>Extra Services</FinancialEntityTh>
          <FinancialEntityTh align="right">Actions</FinancialEntityTh>
        </tr>
      </thead>
      <tbody>
        {feePlans.map((plan) => (
          <tr key={plan.id}>
            <FinancialEntityTd strong>{plan.name}</FinancialEntityTd>
            <FinancialEntityTd>{plan.academicYear?.name ?? "—"}</FinancialEntityTd>
            <FinancialEntityTd>{plan.gradeLevel?.name ?? "—"}</FinancialEntityTd>
            <FinancialEntityTd strong>{plan.baseAmount.toLocaleString()} $</FinancialEntityTd>
            <FinancialEntityTd>
              {plan.extraServices.length > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/[0.08] px-3 py-1.5 text-[12px] font-medium text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {plan.extraServices.length} Services
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                  No Services
                </span>
              )}
            </FinancialEntityTd>
            <FinancialEntityTd align="right">
              <FinancialActionMenu
                isOpen={false}
                onOpenChange={() => undefined}
                onEdit={() => onEdit(plan)}
                onDelete={() => onDelete(plan)}
              />
            </FinancialEntityTd>
          </tr>
        ))}
      </tbody>
    </FinancialEntityTable>
  );
}
