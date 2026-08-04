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
import type { FinancialAccount } from "../../types/finance.types";

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
  account: FinancialAccount | null;
  students: ContractStudentOption[];
  feePlans: FeePlanOption[];
  installmentPolicies: Option[];
  isLoading?: boolean;
  onSubmit: (
    accountId: string | number,
    studentId: string | number,
    values: ContractFormValues,
  ) => void;
};

export function UpdateContractDialog({
  open,
  onOpenChange,
  account,
  students,
  feePlans,
  installmentPolicies,
  onSubmit,
  isLoading,
}: Props) {
  const defaultValues: ContractFormValues | undefined = account
    ? {
        studentId: Number(account.studentId),
        academicYearId: Number(account.academicYearId),
        feePlanId: Number(account.feePlan?.id),
        installmentPolicyId: Number(account.installmentPolicy?.id),
        selectedExtraServiceIds: [],
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[22px] border-border/45 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-medium text-foreground/88">
            Update Financial Contract
          </DialogTitle>
          <DialogDescription className="font-normal">
            Update the fee plan or installment policy. The academic year stays
            synchronized with the selected student enrollment.
          </DialogDescription>
        </DialogHeader>

        {account ? (
          <ContractForm
            students={students}
            feePlans={feePlans}
            installmentPolicies={installmentPolicies}
            defaultValues={defaultValues}
            isLoading={isLoading}
            onSubmit={(values) => onSubmit(account.id, account.studentId, values)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
