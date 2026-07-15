import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  installmentPolicySchema,
  type InstallmentPolicyFormValues,
} from "../../schemas/installmentPolicy.schema";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type Props = {
  defaultValues?: Partial<InstallmentPolicyFormValues>;

  isLoading?: boolean;

  onSubmit: (
    values: InstallmentPolicyFormValues
  ) => void;
};

export function InstallmentPolicyForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InstallmentPolicyFormValues>({
    resolver: zodResolver(
      installmentPolicySchema
    ),

    defaultValues: {
      name: defaultValues?.name ?? "",

      items:
        defaultValues?.items ?? [
          {
            title: "",
            percentage: 100,
            dueMonth: 9,
            dueDay: 1,
          },
        ],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Policy Name */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Policy Name
        </label>

        <Input
          placeholder="Installment Policy"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Installments */}

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold text-lg">
            Installments
          </h3>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                title: "",
                percentage: 0,
                dueMonth: 1,
                dueDay: 1,
              })
            }
          >
            + Add Installment
          </Button>

        </div>
         {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-xl border p-5 space-y-4 bg-card"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Installment #{index + 1}
              </h4>

              {fields.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Input
                placeholder="Installment Title"
                {...register(`items.${index}.title`)}
              />
              {errors.items?.[index]?.title && (
                <p className="text-sm text-destructive">
                  {/* تم إضافة ?. قبل [index] */}
                  {errors.items?.[index]?.title?.message} 
                </p>
              )}
            </div>

            {/* Percentage */}
            <div className="space-y-1">
              <Input
                type="number"
                min={1}
                max={100}
                placeholder="Percentage"
                {...register(`items.${index}.percentage`, {
                  valueAsNumber: true,
                })}
              />
              {errors.items?.[index]?.percentage && (
                <p className="text-sm text-destructive">
                  {/* تم إضافة ?. قبل [index] */}
                  {errors.items?.[index]?.percentage?.message}
                </p>
              )}
            </div>

            {/* Month */}
            <div className="space-y-1">
              <Input
                type="number"
                min={1}
                max={12}
                placeholder="Due Month"
                {...register(`items.${index}.dueMonth`, {
                  valueAsNumber: true,
                })}
              />
              {errors.items?.[index]?.dueMonth && (
                <p className="text-sm text-destructive">
                  {/* تم إضافة ?. قبل [index] */}
                  {errors.items?.[index]?.dueMonth?.message}
                </p>
              )}
            </div>

            {/* Day */}
            <div className="space-y-1">
              <Input
                type="number"
                min={1}
                max={31}
                placeholder="Due Day"
                {...register(`items.${index}.dueDay`, {
                  valueAsNumber: true,
                })}
              />
              {errors.items?.[index]?.dueDay && (
                <p className="text-sm text-destructive">
                  {/* تم إضافة ?. قبل [index] */}
                  {errors.items?.[index]?.dueDay?.message}
                </p>
              )}
            </div>
          </div>
        ))}

      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading
          ? "Saving..."
          : "Save Policy"}
      </Button>

    </form>
  );
}