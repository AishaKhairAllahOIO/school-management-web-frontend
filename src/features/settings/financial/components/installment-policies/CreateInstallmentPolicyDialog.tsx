import { InstallmentPolicyForm } from "./InstallmentPolicyForm";
import { FinancialBaseDialog } from "../../shared/FinancialBaseDialog";
import type { InstallmentPolicyFormValues } from "../../schemas/installmentPolicy.schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onSubmit: (values: InstallmentPolicyFormValues) => void;
};

export function CreateInstallmentPolicyDialog({ open, onOpenChange, onSubmit, isLoading }: Props) {
  if (!open) return null;
  return (
    <FinancialBaseDialog
      title="Create Installment Policy"
      description="Define payment percentages and due dates for a new installment policy."
      onClose={() => onOpenChange(false)}
    >
      <InstallmentPolicyForm
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
        onSubmit={onSubmit}
      />
    </FinancialBaseDialog>
  );
}
