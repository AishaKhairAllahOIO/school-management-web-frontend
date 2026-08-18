import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useStudentFullProfile } from "../../../users/students/hooks/useStudents";
import {
  contractSchema,
  type ContractFormValues,
} from "../schemas/contract.schema";

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

export type ContractStudentOption = {
  id: number | string;
  name: string;
  enrollmentId: number | string;
};

type ContractFormOption = { id: number | string; name: string };
type ContractFormFeePlanOption = ContractFormOption & {
  extraServices?: {
    id: number | string;
    name: string;
    amount: number;
  }[];
};

type ContractFormProps = {
  students: ContractStudentOption[];
  feePlans: ContractFormFeePlanOption[];
  installmentPolicies: ContractFormOption[];
  isLoading?: boolean;
  defaultValues?: ContractFormValues;
  onSubmit: (values: ContractFormValues) => void;
  lockStudent?: boolean;
};

export function ContractForm({
  students,
  feePlans,
  installmentPolicies,
  onSubmit,
  defaultValues,
  isLoading = false,
  lockStudent = false,
}: ContractFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema) as any,
    defaultValues: {
      studentId: 0,
      academicYearId: 0,
      feePlanId: 0,
      installmentPolicyId: 0,
      selectedExtraServiceIds: [],
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedStudentId = watch("studentId");
  const selectedFeePlanId = watch("feePlanId");
  const selectedServices = watch("selectedExtraServiceIds") || [];

  const selectedStudent = useMemo(
    () =>
      students.find(
        (student) => String(student.id) === String(selectedStudentId),
      ),
    [selectedStudentId, students],
  );

  const {
    data: selectedStudentProfile,
    isLoading: isLoadingStudentProfile,
    isError: isStudentProfileError,
  } = useStudentFullProfile(selectedStudent?.enrollmentId);

  const academicYear = selectedStudentProfile?.enrollment.academicYear;
  const resolvedAcademicYearId =
    selectedStudentProfile?.enrollment.academicYearId;

  useEffect(() => {
    if (
      resolvedAcademicYearId !== undefined &&
      resolvedAcademicYearId !== null
    ) {
      setValue("academicYearId", Number(resolvedAcademicYearId), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [resolvedAcademicYearId, setValue]);

  const currentFeePlan = feePlans.find(
    (plan) => String(plan.id) === String(selectedFeePlanId),
  );

  const toggleService = (serviceId: number) => {
    if (selectedServices.includes(serviceId)) {
      setValue(
        "selectedExtraServiceIds",
        selectedServices.filter((id) => id !== serviceId),
      );
      return;
    }

    setValue("selectedExtraServiceIds", [...selectedServices, serviceId]);
  };

  const academicYearLabel = academicYear?.name
    ? academicYear.name
    : resolvedAcademicYearId
      ? `Academic year #${resolvedAcademicYearId}`
      : "Loading academic year";

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as ContractFormValues))}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {!lockStudent ? (
          <>
            <div className="space-y-2.5">
              <label className="text-[11.5px] font-semibold text-foreground/78">
                Student
              </label>
              <Controller
                control={control}
                name="studentId"
                render={({ field }) => (
                  <Select
                    disabled={lockStudent}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      setValue("academicYearId", 0, {
                        shouldValidate: false,
                      });
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-[13px] border-border/45 bg-background/80 font-normal shadow-none focus:ring-2 focus:ring-primary/10">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={String(student.id)}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.studentId ? (
                <p className="text-sm text-destructive">
                  {String(errors.studentId.message)}
                </p>
              ) : null}
            </div>

            <div className="space-y-2.5">
              <label className="text-[11.5px] font-semibold text-foreground/78">
                Academic Year
              </label>
              <div
                className={[
                  "flex h-11 items-center gap-2 rounded-xl border px-3.5 text-sm",
                  isStudentProfileError
                    ? "border-destructive/20 bg-destructive/[0.035] text-destructive"
                    : "border-border/45 bg-muted/18 text-foreground/75",
                ].join(" ")}
              >
                <CalendarDays
                  className="h-4 w-4 text-primary"
                  strokeWidth={1.8}
                />
                {isLoadingStudentProfile ? (
                  <span className="h-3.5 w-40 animate-pulse rounded-full bg-muted/75" />
                ) : (
                  <span className="truncate font-normal">
                    {isStudentProfileError
                      ? "Could not load the student's academic year"
                      : academicYearLabel}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] font-normal text-muted-foreground/75">
                Filled automatically from the student’s active enrollment.
              </p>
              {errors.academicYearId ? (
                <p className="text-sm text-destructive">
                  {String(errors.academicYearId.message)}
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        <div className="space-y-2.5">
          <label className="text-[11.5px] font-semibold text-foreground/78">
            Fee Plan
          </label>
          <Controller
            control={control}
            name="feePlanId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => {
                  field.onChange(Number(value));
                  setValue("selectedExtraServiceIds", []);
                }}
              >
                <SelectTrigger className="h-11 rounded-[13px] border-border/45 bg-background/80 font-normal shadow-none focus:ring-2 focus:ring-primary/10">
                  <SelectValue placeholder="Select fee plan" />
                </SelectTrigger>
                <SelectContent>
                  {feePlans.map((plan) => (
                    <SelectItem key={plan.id} value={String(plan.id)}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.feePlanId ? (
            <p className="text-sm text-destructive">
              {String(errors.feePlanId.message)}
            </p>
          ) : null}
        </div>

        <div className="space-y-2.5">
          <label className="text-[11.5px] font-semibold text-foreground/78">
            Installment Policy
          </label>
          <Controller
            control={control}
            name="installmentPolicyId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger className="h-11 rounded-[13px] border-border/45 bg-background/80 font-normal shadow-none focus:ring-2 focus:ring-primary/10">
                  <SelectValue placeholder="Select installment policy" />
                </SelectTrigger>
                <SelectContent>
                  {installmentPolicies.map((policy) => (
                    <SelectItem key={policy.id} value={String(policy.id)}>
                      {policy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.installmentPolicyId ? (
            <p className="text-sm text-destructive">
              {String(errors.installmentPolicyId.message)}
            </p>
          ) : null}
        </div>
      </div>

      {currentFeePlan?.extraServices?.length ? (
        <div className="space-y-3 rounded-[21px] border border-border/40 bg-muted/[0.14] p-4 shadow-[0_8px_24px_rgba(31,22,73,0.025)]">
          <h3 className="text-[11.5px] font-semibold text-foreground/78">
            Optional Extra Services
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentFeePlan.extraServices.map((service) => {
              const selected = selectedServices.includes(Number(service.id));

              return (
                <label
                  key={service.id}
                  className={[
                    "flex cursor-pointer items-center justify-between rounded-[15px] border p-3 transition-all duration-200",
                    selected
                      ? "border-primary/25 bg-primary/[0.055] shadow-[0_6px_18px_rgba(99,78,181,0.06)]"
                      : "border-border/40 bg-background/75 hover:-translate-y-0.5 hover:bg-muted/20",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      checked={selected}
                      onChange={() => toggleService(Number(service.id))}
                    />
                    <span className="text-sm font-normal text-foreground/82">
                      {service.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground/85">
                    {service.amount.toLocaleString()} $
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <Button
        type="submit"
        variant="outline"
        className="h-11 w-full rounded-[14px] border-primary/20 bg-primary text-[12px] font-semibold text-primary-foreground shadow-[0_9px_24px_rgba(99,78,181,0.18)] hover:bg-primary/90"
        disabled={
          isLoading || isLoadingStudentProfile || !resolvedAcademicYearId
        }
      >
        {isLoading ? "Saving Contract..." : "Save Contract"}
      </Button>
    </form>
  );
}
