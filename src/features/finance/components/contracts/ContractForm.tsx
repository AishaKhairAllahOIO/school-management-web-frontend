import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays } from "lucide-react";

import { Button } from "@/shared/ui/button";
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
} from "../../schemas/contract.schema";

export type ContractStudentOption = {
  id: number | string;
  name: string;
  enrollmentId: number | string;
};

type Option = { id: number | string; name: string };
type FeePlanOption = Option & {
  extraServices?: {
    id: number | string;
    name: string;
    amount: number;
  }[];
};

type Props = {
  students: ContractStudentOption[];
  feePlans: FeePlanOption[];
  installmentPolicies: Option[];
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
}: Props) {
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
    if (resolvedAcademicYearId !== undefined && resolvedAcademicYearId !== null) {
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

    setValue("selectedExtraServiceIds", [
      ...selectedServices,
      serviceId,
    ]);
  };

  const academicYearLabel = academicYear?.name
    ? academicYear.name
    : resolvedAcademicYearId
      ? `Academic year #${resolvedAcademicYearId}`
      : "Loading academic year";

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit(data as ContractFormValues),
      )}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {!lockStudent ? (
          <>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/85">
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
                <SelectTrigger className="h-11 rounded-xl border-border/50 bg-white font-normal">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem
                      key={student.id}
                      value={String(student.id)}
                    >
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/85">
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
            <CalendarDays className="h-4 w-4 text-primary" strokeWidth={1.8} />
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/85">
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
                <SelectTrigger className="h-11 rounded-xl border-border/50 bg-white font-normal">
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/85">
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
                <SelectTrigger className="h-11 rounded-xl border-border/50 bg-white font-normal">
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
        <div className="space-y-3 rounded-2xl border border-border/40 bg-muted/15 p-5">
          <h3 className="text-sm font-medium text-foreground/85">
            Optional Extra Services
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentFeePlan.extraServices.map((service) => {
              const selected = selectedServices.includes(Number(service.id));

              return (
                <label
                  key={service.id}
                  className={[
                    "flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors",
                    selected
                      ? "border-primary/25 bg-primary/[0.045]"
                      : "border-border/40 bg-white hover:bg-muted/20",
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
        className="h-11 w-full rounded-xl border-primary/35 bg-white font-medium text-primary hover:border-primary/50 hover:bg-primary/[0.045] hover:text-primary"
        disabled={
          isLoading ||
          isLoadingStudentProfile ||
          !resolvedAcademicYearId
        }
      >
        {isLoading ? "Saving Contract..." : "Save Contract"}
      </Button>
    </form>
  );
}
