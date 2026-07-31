import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import {
  ContractForm,
  type ContractStudentOption,
} from "./ContractForm";
import type { ContractFormValues } from "../../schemas/contract.schema";

type Option = { id: number | string; name: string };
type FeePlanOption = Option & {
  extraServices?: {
    id: number | string;
    name: string;
    amount: number;
  }[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: ContractStudentOption[];
  feePlans: FeePlanOption[];
  installmentPolicies: Option[];
  isLoading?: boolean;
  onSubmit: (values: ContractFormValues) => void;
};

export function FinalizeContractDialog({
  open,
  onOpenChange,
  students,
  feePlans,
  installmentPolicies,
  onSubmit,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[22px] border-border/45 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-medium text-foreground/88">
            New Financial Contract
          </DialogTitle>
          <DialogDescription className="font-normal">
            Select a student. The academic year is filled automatically from
            the active enrollment.
          </DialogDescription>
        </DialogHeader>

        <ContractForm
          students={students}
          feePlans={feePlans}
          installmentPolicies={installmentPolicies}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
