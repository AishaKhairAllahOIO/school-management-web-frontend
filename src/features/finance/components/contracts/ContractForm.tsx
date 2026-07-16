import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { contractSchema, type ContractFormValues } from "../../schemas/contract.schema";

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type Option = { id: number | string; name: string };

type FeePlanOption = Option & { 
  extraServices?: { id: number | string; name: string; amount: number }[] 
};

type Props = {
  students: Option[];
  academicYears: Option[];
  feePlans: FeePlanOption[];
  installmentPolicies: Option[];
  isLoading?: boolean;
  defaultValues?: ContractFormValues; // 👈 هاد السطر الجديد
  onSubmit: (values: ContractFormValues) => void;
};

export function ContractForm({
  students,
  academicYears,
  feePlans,
  installmentPolicies,
  onSubmit,
  defaultValues,
  isLoading = false,
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
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);
  
  const selectedFeePlanId = watch("feePlanId");
  const selectedServices = watch("selectedExtraServiceIds") || [];

  const currentFeePlan = feePlans.find(
    (plan) => String(plan.id) === String(selectedFeePlanId)
  );

  const toggleService = (serviceId: number) => {
    if (selectedServices.includes(serviceId)) {
      setValue(
        "selectedExtraServiceIds",
        selectedServices.filter((id) => id !== serviceId)
      );
    } else {
      setValue("selectedExtraServiceIds", [...selectedServices, serviceId]);
    }
  };

  return (

    <form onSubmit={handleSubmit((data) => onSubmit(data as ContractFormValues))} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* Student Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Student</label>
          <Controller
            control={control}
            name="studentId"
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Student" />
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
          {errors.studentId && <p className="text-sm text-red-500">{String(errors.studentId.message)}</p>}
        </div>

        {/* Academic Year Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Academic Year</label>
          <Controller
            control={control}
            name="academicYearId"
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={String(year.id)}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.academicYearId && <p className="text-sm text-red-500">{String(errors.academicYearId.message)}</p>}
        </div>

        {/* Fee Plan Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Fee Plan</label>
          <Controller
            control={control}
            name="feePlanId"
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => {
                field.onChange(Number(val));
                setValue("selectedExtraServiceIds", []);  
              }}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Fee Plan" />
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
          {errors.feePlanId && <p className="text-sm text-red-500">{String(errors.feePlanId.message)}</p>}
        </div>

        {/* Installment Policy Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Installment Policy</label>
          <Controller
            control={control}
            name="installmentPolicyId"
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(val) => field.onChange(Number(val))}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select Installment Policy" />
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
          {errors.installmentPolicyId && <p className="text-sm text-red-500">{String(errors.installmentPolicyId.message)}</p>}
        </div>
      </div>

      {/* Extra Services Selection (Dynamic) */}
      {currentFeePlan && currentFeePlan.extraServices && currentFeePlan.extraServices.length > 0 && (
        <div className="space-y-3 rounded-2xl border bg-muted/20 p-5">
          <h3 className="font-semibold text-sm">Optional Extra Services</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentFeePlan.extraServices.map((service) => (
              <label
                key={service.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all hover:bg-muted/50 ${
                  selectedServices.includes(Number(service.id))
                    ? "border-violet-500 bg-violet-50/50"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                    checked={selectedServices.includes(Number(service.id))}
                    onChange={() => toggleService(Number(service.id))}
                  />
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {service.amount.toLocaleString()} $
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? "Finalizing Contract..." : "Finalize Contract"}
      </Button>
    </form>
  );
}