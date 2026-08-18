import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CreditCard, Layers3, Sparkles } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type { FinancialAccount } from "../types/finance.types";

type Option = { id: number | string; name: string };
type FeePlanOption = Option;

type UpdateContractValues = {
  feePlanId: number;
  installmentPolicyId: number;
};

const updateContractSchema = z.object({
  feePlanId: z.number().min(1, "Please select the installment amount."),
  installmentPolicyId: z.number().min(1, "Please select the payment policy."),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: FinancialAccount | null;
  feePlans: FeePlanOption[];
  installmentPolicies: Option[];
  isLoading?: boolean;
  onSubmit: (
    accountId: string | number,
    studentId: string | number,
    values: UpdateContractValues,
  ) => void;
};

export function UpdateContractDialog({
  open,
  onOpenChange,
  account,
  feePlans,
  installmentPolicies,
  onSubmit,
  isLoading = false,
}: Props) {
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateContractValues>({
    resolver: zodResolver(updateContractSchema),
    defaultValues: {
      feePlanId: 0,
      installmentPolicyId: 0,
    },
  });

  useEffect(() => {
    if (!account || !open) return;

    reset({
      feePlanId: Number(account.feePlan?.id ?? 0),
      installmentPolicyId: Number(account.installmentPolicy?.id ?? 0),
    });
  }, [account, open, reset]);

  const feePlanId = watch("feePlanId");
  const installmentPolicyId = watch("installmentPolicyId");

  function submit(values: UpdateContractValues) {
    if (!account) return;
    onSubmit(account.id, account.studentId, values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[28px] border-border/45 bg-background/95 p-0 shadow-[0_24px_80px_rgba(31,22,73,0.16)] backdrop-blur-xl sm:max-w-[540px]">
        <div className="relative overflow-hidden px-6 pb-5 pt-6 sm:px-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-primary/[0.09] blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-24 h-32 w-32 rounded-full bg-info/[0.07] blur-3xl" />

          <DialogHeader className="relative text-start">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-primary/15 bg-primary/[0.07] text-primary shadow-sm">
                <Sparkles className="h-[19px] w-[19px]" strokeWidth={1.8} />
              </span>
              <div className="min-w-0 pe-8">
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.025em] text-foreground/92">
                  Edit payment setup
                </DialogTitle>
                <DialogDescription className="mt-1 text-[12px] leading-5 text-muted-foreground/75">
                  Only the installment amount and payment policy can be changed.
                  Student and academic year remain locked.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {account ? (
            <div className="relative mt-5 flex items-center gap-3 rounded-[18px] border border-border/40 bg-card/75 px-4 py-3 shadow-[0_8px_25px_rgba(31,22,73,0.035)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-muted/55 text-muted-foreground">
                <CreditCard className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60">
                  Current setup
                </p>
                <p className="mt-0.5 truncate text-[12.5px] font-medium text-foreground/80">
                  {account.feePlan?.name || "No fee plan"} ·{" "}
                  {account.installmentPolicy?.name || "No policy"}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {account ? (
          <form
            onSubmit={handleSubmit(submit)}
            className="space-y-4 px-6 pb-6 sm:px-7 sm:pb-7"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-border/45 bg-card p-4 shadow-[0_8px_24px_rgba(31,22,73,0.035)]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-primary/[0.07] text-primary">
                    <Layers3 className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground/85">
                      Installment amount
                    </p>
                    <p className="text-[10px] text-muted-foreground/65">
                      Fee plan
                    </p>
                  </div>
                </div>

                <Select
                  value={feePlanId ? String(feePlanId) : ""}
                  onValueChange={(value) =>
                    setValue("feePlanId", Number(value), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="h-11 rounded-[13px] border-border/50 bg-background/80 text-[12px] shadow-none focus:ring-2 focus:ring-primary/10">
                    <SelectValue placeholder="Choose amount" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[14px]">
                    {feePlans.map((plan) => (
                      <SelectItem
                        key={plan.id}
                        value={String(plan.id)}
                        className="rounded-[10px]"
                      >
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.feePlanId ? (
                  <p className="mt-1.5 text-[10.5px] text-destructive">
                    {errors.feePlanId.message}
                  </p>
                ) : null}
              </div>

              <div className="rounded-[20px] border border-border/45 bg-card p-4 shadow-[0_8px_24px_rgba(31,22,73,0.035)]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-info/[0.08] text-info">
                    <CreditCard className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground/85">
                      Payment policy
                    </p>
                    <p className="text-[10px] text-muted-foreground/65">
                      Installment schedule
                    </p>
                  </div>
                </div>

                <Select
                  value={installmentPolicyId ? String(installmentPolicyId) : ""}
                  onValueChange={(value) =>
                    setValue("installmentPolicyId", Number(value), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="h-11 rounded-[13px] border-border/50 bg-background/80 text-[12px] shadow-none focus:ring-2 focus:ring-primary/10">
                    <SelectValue placeholder="Choose policy" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[14px]">
                    {installmentPolicies.map((policy) => (
                      <SelectItem
                        key={policy.id}
                        value={String(policy.id)}
                        className="rounded-[10px]"
                      >
                        {policy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.installmentPolicyId ? (
                  <p className="mt-1.5 text-[10.5px] text-destructive">
                    {errors.installmentPolicyId.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-[16px] border border-success/15 bg-success/[0.045] px-3.5 py-3 text-[10.5px] leading-5 text-muted-foreground/75">
              <Check
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                strokeWidth={2}
              />
              <span>
                The existing student, enrollment, academic year and payment
                history are not changed.
              </span>
            </div>

            <DialogFooter className="gap-2 border-t border-border/35 pt-4 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-10 rounded-[13px] px-4 text-[11.5px] text-muted-foreground hover:bg-muted/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 rounded-[13px] bg-primary px-5 text-[11.5px] font-semibold text-primary-foreground shadow-[0_8px_20px_rgba(99,78,181,0.18)] hover:bg-primary/90"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
