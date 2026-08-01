import { CalendarRange } from "lucide-react";

import type { InstallmentPolicy } from "../../types/installmentPolicy.types";
import { FinancialActionMenu } from "../../shared/FinancialActionMenu";
import {
  FinancialEntityTable,
  FinancialEntityTd,
  FinancialEntityTh,
} from "../../shared/FinancialEntityTable";

type Props = {
  policies: InstallmentPolicy[];
  onEdit: (policy: InstallmentPolicy) => void;
  onDelete: (policy: InstallmentPolicy) => void;
};

export function InstallmentPoliciesTable({ policies, onEdit, onDelete }: Props) {
  if (!policies.length) {
    return (
      <div className="mt-4 rounded-[18px] border border-dashed border-border bg-muted/15 p-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-[13px] bg-primary/[0.08] text-primary">
          <CalendarRange size={18} strokeWidth={1.8} />
        </span>
        <p className="mt-3 text-[15px] font-medium text-foreground">No installment policies yet</p>
        <p className="mt-1 text-[13px] font-normal text-muted-foreground">
          Create a payment schedule to distribute tuition across multiple due dates.
        </p>
      </div>
    );
  }

  return (
    <FinancialEntityTable>
      <thead>
        <tr>
          <FinancialEntityTh>Name</FinancialEntityTh>
          <FinancialEntityTh>Installments</FinancialEntityTh>
          <FinancialEntityTh>Created</FinancialEntityTh>
          <FinancialEntityTh align="right">Actions</FinancialEntityTh>
        </tr>
      </thead>
      <tbody>
        {policies.map((policy) => (
          <tr key={policy.id}>
            <FinancialEntityTd strong>{policy.name}</FinancialEntityTd>
            <FinancialEntityTd>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/[0.09] px-3 py-1.5 text-[12px] font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {policy.items.length} Installments
              </span>
            </FinancialEntityTd>
            <FinancialEntityTd>{new Date(policy.createdAt).toLocaleDateString()}</FinancialEntityTd>
            <FinancialEntityTd align="right">
              <FinancialActionMenu
                isOpen={false}
                onOpenChange={() => undefined}
                onEdit={() => onEdit(policy)}
                onDelete={() => onDelete(policy)}
              />
            </FinancialEntityTd>
          </tr>
        ))}
      </tbody>
    </FinancialEntityTable>
  );
}
