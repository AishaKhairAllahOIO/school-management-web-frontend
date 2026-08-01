import { FeePlanForm } from "./FeePlanForm";
import { FinancialBaseDialog } from "../../shared/FinancialBaseDialog";
import type { FeePlanFormValues } from "../../schemas/feePlan.schema";

type Option = { id: number; name: string };
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: FeePlanFormValues;
  academicYears: Option[];
  gradeLevels: Option[];
  isLoading?: boolean;
  onSubmit: (values: FeePlanFormValues) => void;
};

export function EditFeePlanDialog({ open, onOpenChange, defaultValues, academicYears, gradeLevels, onSubmit, isLoading }: Props) {
  if (!open) return null;
  return (
    <FinancialBaseDialog
      title="Edit Fee Plan"
      description="Update the selected fee plan and its optional services."
      onClose={() => onOpenChange(false)}
    >
      <FeePlanForm
        defaultValues={defaultValues}
        academicYears={academicYears}
        gradeLevels={gradeLevels}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
        onSubmit={onSubmit}
      />
    </FinancialBaseDialog>
  );
}
