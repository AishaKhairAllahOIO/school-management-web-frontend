import { InstallmentPolicyForm } from "./InstallmentPolicyForm";
import { FinancialBaseDialog } from "../../shared/FinancialBaseDialog";
import type { InstallmentPolicyFormValues } from "../../schemas/installmentPolicy.schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: InstallmentPolicyFormValues;
  isLoading?: boolean;
  onSubmit: (values: InstallmentPolicyFormValues) => void;
};

export function EditInstallmentPolicyDialog({ open, onOpenChange, defaultValues, onSubmit, isLoading }: Props) {
  if (!open) return null;
  return (
    <FinancialBaseDialog
      title="Edit Installment Policy"
      description="Adjust how student invoices are divided and when each installment becomes due."
      onClose={() => onOpenChange(false)}
    >
      <InstallmentPolicyForm
        defaultValues={defaultValues}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
        onSubmit={onSubmit}
      />
    </FinancialBaseDialog>
  );
}
