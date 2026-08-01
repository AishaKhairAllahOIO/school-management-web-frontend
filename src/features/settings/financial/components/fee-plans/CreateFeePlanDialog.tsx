import { FeePlanForm } from "./FeePlanForm";
import { FinancialBaseDialog } from "../../shared/FinancialBaseDialog";
import type { FeePlanFormValues } from "../../schemas/feePlan.schema";

type Option = { id: number; name: string };
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYears: Option[];
  gradeLevels: Option[];
  isLoading?: boolean;
  onSubmit: (values: FeePlanFormValues) => void;
};

export function CreateFeePlanDialog({ open, onOpenChange, academicYears, gradeLevels, onSubmit, isLoading }: Props) {
  if (!open) return null;
  return (
    <FinancialBaseDialog
      title="Create Fee Plan"
      description="Create a tuition fee configuration for an academic year and grade level."
      onClose={() => onOpenChange(false)}
    >
      <FeePlanForm
        academicYears={academicYears}
        gradeLevels={gradeLevels}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
        onSubmit={onSubmit}
      />
    </FinancialBaseDialog>
  );
}
