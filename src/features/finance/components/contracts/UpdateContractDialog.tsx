import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { ContractForm } from "./ContractForm";
import type { ContractFormValues } from "../../schemas/contract.schema";
import type { FinancialAccount } from "../../types/finance.types";

type Option = { id: number | string; name: string };
type FeePlanOption = Option & { 
  extraServices?: { id: number | string; name: string; amount: number }[] 
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: FinancialAccount | null;
  students: Option[];
  academicYears: Option[];
  feePlans: FeePlanOption[];
  installmentPolicies: Option[];
  isLoading?: boolean;
  onSubmit: (studentId: string | number, values: ContractFormValues) => void;
};

export function UpdateContractDialog({
  open,
  onOpenChange,
  account,
  students,
  academicYears,
  feePlans,
  installmentPolicies,
  onSubmit,
  isLoading,
}: Props) {
  
  // تجهيز البيانات القديمة لتعبئة الفورم
  const defaultValues: ContractFormValues | undefined = account ? {
    studentId: Number(account.studentId),
    academicYearId: Number(account.academicYearId),
    feePlanId: Number(account.feePlan?.id),
    installmentPolicyId: Number(account.installmentPolicy?.id),
    selectedExtraServiceIds: [], // مصفوفة الخدمات
  } : undefined;

  function handleSubmit(values: ContractFormValues) {
    if (account) {
      onSubmit(account.studentId, values);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Financial Contract</DialogTitle>
          <DialogDescription>
            Modify the student's fee plan or installment policy. Note: This action will be rejected if the student has already made payments.
          </DialogDescription>
        </DialogHeader>

        {account && (
          <ContractForm
            students={students}
            academicYears={academicYears}
            feePlans={feePlans}
            installmentPolicies={installmentPolicies}
            defaultValues={defaultValues}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}