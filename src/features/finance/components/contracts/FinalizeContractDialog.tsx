import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { ContractForm } from "./ContractForm";
import type { ContractFormValues } from "../../schemas/contract.schema";

type Option = { id: number | string; name: string };
type FeePlanOption = Option & { 
  extraServices?: { id: number | string; name: string; amount: number }[] 
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Option[];
  academicYears: Option[];
  feePlans: FeePlanOption[];
  installmentPolicies: Option[];
  isLoading?: boolean;
  onSubmit: (values: ContractFormValues) => void;
};

export function FinalizeContractDialog({
  open,
  onOpenChange,
  students,
  academicYears,
  feePlans,
  installmentPolicies,
  onSubmit,
  isLoading,
}: Props) {
  
  function handleSubmit(values: ContractFormValues) {
    onSubmit(values);
    // لن نغلق النافذة هنا مباشرة، سنغلقها من خلال الـ onSuccess في الـ Hook
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalize Financial Contract</DialogTitle>
          <DialogDescription>
            Create a new financial account and generate installment schedule for a student.
          </DialogDescription>
        </DialogHeader>

        <ContractForm
          students={students}
          academicYears={academicYears}
          feePlans={feePlans}
          installmentPolicies={installmentPolicies}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}