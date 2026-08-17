import { useEffect } from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  Loader2,
  X,
} from "lucide-react";

import { Button } from "@/shared/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  useAcademicYears,
} from "../../../settings/academic/hooks/useAcademicSettings";

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
  const createMutation =
    useCreateContract();

  const updateMutation =
    useUpdateContract();

  const academicYearsQuery =
    useAcademicYears();

  const isEdit =
    Boolean(contract);

  const {
    register,
    control,
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

  /* ============================================================
     Reset form when dialog opens
     ============================================================ */

  useEffect(() => {
    if (!open) {
      return;
    }

    if (contract) {
      reset({
    academic_year_id: String(
  contract.academic_year ?? "",
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
  }, [
    open,
    contract,
    reset,
  ]);

  if (!open) {
    return null;
  }

  const loading =
    createMutation.isPending ||
    updateMutation.isPending;

  const academicYears =
    academicYearsQuery.data ?? [];

  const academicYearsLoading =
    academicYearsQuery.isLoading;

  /* ============================================================
     Submit
     ============================================================ */

  async function submit(
    values: FormValues,
  ) {
    const academicYearId =
      values.academic_year_id.trim();

    const salaryAmount =
      Number(
        values.salary_amount,
      );

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
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-4
      "
    >
      {/* ========================================================
          BACKDROP
         ======================================================== */}

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/30
          backdrop-blur-[2px]
        "
      />

      {/* ========================================================
          DIALOG
         ======================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          rounded-[24px]
          border
          border-border/50
          bg-card
          shadow-2xl
        "
      >
        {/* ======================================================
            HEADER
           ====================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-border/50
            px-5
            py-4
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-[14px]
                font-bold
                text-foreground
              "
            >
              {isEdit
                ? "Edit contract"
                : "Add financial contract"}
            </h2>

            <p
              className="
                mt-1
                text-[10.5px]
                leading-4
                text-muted-foreground
              "
            >
              {isEdit
                ? "Update the salary agreement."
                : "Create a salary agreement for this employee."}
            </p>
          </div>

          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            className="
              flex
              size-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <X
              className="size-4"
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* ======================================================
            FORM
           ====================================================== */}

        <form
          onSubmit={handleSubmit(submit)}
          className="
            space-y-4
            p-5
          "
        >
          {/* ====================================================
              ACADEMIC YEAR
             ==================================================== */}

          <div className="space-y-1.5">
            <label
              className="
                text-xs
                font-semibold
                text-foreground
              "
            >
              Academic year
            </label>

            <Controller
              name="academic_year_id"
              control={control}
              rules={{
                required:
                  "Academic year is required.",
              }}
              render={({
                field,
              }) => (
                <Select
                  value={
                    field.value
                  }
                  onValueChange={
                    field.onChange
                  }
                  disabled={
                    loading ||
                    academicYearsLoading
                  }
                >
                  <SelectTrigger
                    className="
                      h-10
                      w-full
                      rounded-[12px]
                      border-border/65
                      bg-background
                      px-3.5
                      text-[12px]
                    "
                  >
                    <SelectValue
                      placeholder={
                        academicYearsLoading
                          ? "Loading academic years..."
                          : "Select academic year"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {academicYears.map(
                      (year) => (
                        <SelectItem
                          key={String(
                            year.id,
                          )}
                          value={String(
                            year.id,
                          )}
                        >
                          {year.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.academic_year_id && (
              <p
                className="
                  text-xs
                  text-destructive
                "
              >
                {
                  errors
                    .academic_year_id
                    .message
                }
              </p>
            )}

            {!academicYearsLoading &&
              academicYears.length === 0 && (
                <p
                  className="
                    text-[10px]
                    text-muted-foreground
                  "
                >
                  No academic years are available.
                </p>
              )}
          </div>

          {/* ====================================================
              SALARY TYPE
             ==================================================== */}

          <div className="space-y-1.5">
            <label
              className="
                text-xs
                font-semibold
                text-foreground
              "
            >
              Salary type
            </label>

            <Controller
              name="salary_type"
              control={control}
              render={({
                field,
              }) => (
                <Select
                  value={
                    field.value
                  }
                  onValueChange={
                    field.onChange
                  }
                  disabled={loading}
                >
                  <SelectTrigger
                    className="
                      h-10
                      w-full
                      rounded-[12px]
                      border-border/65
                      bg-background
                      px-3.5
                      text-[12px]
                    "
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="fixed_monthly">
                      Fixed monthly
                    </SelectItem>

                    <SelectItem value="per_period">
                      Per period
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* ====================================================
              SALARY AMOUNT
             ==================================================== */}

          <div className="space-y-1.5">
            <label
              className="
                text-xs
                font-semibold
                text-foreground
              "
            >
              Salary amount
            </label>

            <input
              {...register(
                "salary_amount",
                {
                  required:
                    "Salary amount is required.",

                  validate: (
                    value,
                  ) =>
                    Number(value) >
                      0 ||
                    "Enter a valid amount.",
                },
              )}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              disabled={loading}
              dir="ltr"
              className="
                h-10
                w-full
                rounded-xl
                border
                border-border/60
                bg-background
                px-3
                text-left
                text-sm
                outline-none
                transition
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />

            {errors.salary_amount && (
              <p
                className="
                  text-xs
                  text-destructive
                "
              >
                {
                  errors
                    .salary_amount
                    .message
                }
              </p>
            )}
          </div>

          {/* ====================================================
              ERROR
             ==================================================== */}

          {(createMutation.isError ||
            updateMutation.isError) && (
            <div
              className="
                rounded-xl
                bg-destructive/8
                px-3
                py-2.5
                text-xs
                text-destructive
              "
            >
              Failed to save the contract.
              Please try again.
            </div>
          )}

          {/* ====================================================
              ACTIONS
             ==================================================== */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-4
              pt-1
            "
          >
            {/* Cancel */}

            <Button
              type="button"
              variant="ghost"
              className="
                h-auto
                rounded-none
                px-1
                py-1
                text-[12px]
                font-semibold
                text-muted-foreground
                underline
                underline-offset-4
                decoration-muted-foreground/40
                hover:bg-transparent
                hover:text-foreground
                hover:decoration-foreground
              "
              onClick={onClose}
              disabled={loading}
            >
              <span>
                Cancel
              </span>
            </Button>

            {/* Save / Create */}

            <Button
              type="submit"
              variant="ghost"
              className="
                h-auto
                rounded-none
                px-1
                py-1
                text-[12px]
                font-semibold
                text-primary
                underline
                underline-offset-4
                decoration-primary/40
                hover:bg-transparent
                hover:text-primary/75
                hover:decoration-primary
              "
              disabled={
                loading ||
                academicYearsLoading ||
                academicYears.length === 0
              }
            >
              {loading && (
                <Loader2
                  className="
                    mr-1.5
                    size-3.5
                    animate-spin
                  "
                />
              )}

              <span>
                {isEdit
                  ? "Save changes"
                  : "Create contract"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}