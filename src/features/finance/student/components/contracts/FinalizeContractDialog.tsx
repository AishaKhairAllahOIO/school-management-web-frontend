import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { ContractForm, type ContractStudentOption } from "./ContractForm";
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
      <DialogContent className="max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-[28px] border-border/45 bg-background/95 p-0 shadow-[0_24px_80px_rgba(31,22,73,0.16)] backdrop-blur-xl sm:max-w-2xl">
        <div className="relative overflow-hidden px-6 pb-5 pt-6 sm:px-7">
          <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-primary/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -left-24 top-20 h-40 w-40 rounded-full bg-info/[0.06] blur-3xl" />
          <DialogHeader className="relative text-start">
            <DialogTitle className="text-[19px] font-semibold tracking-[-0.025em] text-foreground/92">
              New financial contract
            </DialogTitle>
            <DialogDescription className="mt-1 max-w-xl text-[12px] leading-5 text-muted-foreground/75">
              Set the student's fee plan, payment policy and optional services.
              The active enrollment supplies the academic year automatically.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 sm:px-7 sm:pb-7">
          <ContractForm
            students={students}
            lockStudent={students.length === 1}
            defaultValues={
              students.length === 1
                ? {
                    studentId: Number(students[0].id),
                    academicYearId: 0,
                    feePlanId: 0,
                    installmentPolicyId: 0,
                    selectedExtraServiceIds: [],
                  }
                : undefined
            }
            feePlans={feePlans}
            installmentPolicies={installmentPolicies}
            isLoading={isLoading}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
