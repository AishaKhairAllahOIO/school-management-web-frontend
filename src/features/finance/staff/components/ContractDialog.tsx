import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { X, Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

import {
  useCreateContract,
  useUpdateContract,
} from "../hooks/useStaffContracts";

import type {
  ApiId,
  SalaryType,
  StaffFinancialContract,
} from "../types/payroll.types";

type FormValues = {
  academic_year_id: string;
  salary_type: SalaryType;
  salary_amount: string;
};

type Props = {
  open: boolean;
  staffId: ApiId;
  contract?: StaffFinancialContract | null;
  onClose: () => void;
};

export function ContractDialog({
  open,
  staffId,
  contract,
  onClose,
}: Props) {
  const createMutation = useCreateContract();
  const updateMutation = useUpdateContract();

  const isEdit = Boolean(contract);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<FormValues>({
    defaultValues: {
      academic_year_id: "",
      salary_type: "fixed_monthly",
      salary_amount: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (contract) {
      reset({
        academic_year_id: String(
          contract.academic_year_id ??
            contract.academic_year ??
            "",
        ),

        salary_type:
          contract.salary_type,

        salary_amount:
          String(
            contract.salary_amount ?? "",
          ),
      });

      return;
    }

    reset({
      academic_year_id: "",
      salary_type: "fixed_monthly",
      salary_amount: "",
    });
  }, [open, contract, reset]);

  if (!open) {
    return null;
  }

  const loading =
    createMutation.isPending ||
    updateMutation.isPending;

  async function submit(
    values: FormValues,
  ) {
    const academicYearId =
      values.academic_year_id.trim();

    const salaryAmount =
      Number(values.salary_amount);

    if (!academicYearId) {
      return;
    }

    if (
      !Number.isFinite(
        salaryAmount,
      ) ||
      salaryAmount <= 0
    ) {
      return;
    }

    if (contract) {
      await updateMutation.mutateAsync({
        id: contract.id,

        payload: {
          academic_year_id:
            academicYearId,

          salary_type:
            values.salary_type,

          salary_amount:
            salaryAmount,
        },
      });
    } else {
      await createMutation.mutateAsync({
        staff_id: staffId,

        academic_year_id:
          academicYearId,

        salary_type:
          values.salary_type,

        salary_amount:
          salaryAmount,
      });
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div
        className="
          relative z-10 w-full max-w-md
          overflow-hidden rounded-[24px]
          border border-border/50
          bg-card
          shadow-2xl
        "
      >
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-foreground">
              {isEdit
                ? "Edit contract"
                : "Add financial contract"}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {isEdit
                ? "Update the salary agreement."
                : "Create a salary agreement for this employee."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex size-8 items-center
              justify-center rounded-xl
              text-muted-foreground
              transition hover:bg-muted
              hover:text-foreground
            "
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="space-y-4 p-5"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Academic year
            </label>

            <input
              {...register(
                "academic_year_id",
                {
                  required:
                    "Academic year is required.",
                },
              )}
              placeholder="Academic year ID"
              className="
                h-10 w-full rounded-xl
                border border-border/60
                bg-background px-3
                text-sm outline-none
                transition
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
              "
            />

            {errors.academic_year_id && (
              <p className="text-xs text-destructive">
                {
                  errors.academic_year_id
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Salary type
            </label>

            <select
              {...register(
                "salary_type",
              )}
              className="
                h-10 w-full rounded-xl
                border border-border/60
                bg-background px-3
                text-sm outline-none
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
              "
            >
              <option value="fixed_monthly">
                Fixed monthly
              </option>

              <option value="per_period">
                Per period
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Salary amount
            </label>

            <input
              {...register(
                "salary_amount",
                {
                  required:
                    "Salary amount is required.",
                  validate: (value) =>
                    Number(value) > 0 ||
                    "Enter a valid amount.",
                },
              )}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="
                h-10 w-full rounded-xl
                border border-border/60
                bg-background px-3
                text-sm outline-none
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
              "
            />

            {errors.salary_amount && (
              <p className="text-xs text-destructive">
                {
                  errors.salary_amount
                    .message
                }
              </p>
            )}
          </div>

          {(createMutation.isError ||
            updateMutation.isError) && (
            <div className="rounded-xl bg-destructive/8 px-3 py-2.5 text-xs text-destructive">
              Failed to save the contract.
              Please try again.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="rounded-xl"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              {isEdit
                ? "Save changes"
                : "Create contract"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}