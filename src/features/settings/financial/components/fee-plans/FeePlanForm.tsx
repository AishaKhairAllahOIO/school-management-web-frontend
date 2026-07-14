 import {
  Controller,
  useFieldArray,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Plus, Trash2 } from "lucide-react";

import {
  feePlanSchema,
  type FeePlanFormValues,
} from "../../schemas/feePlan.schema";

import { Button } from "@/shared/ui/button";

import { Input } from "@/shared/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type Option = {
  id: number;
  name: string;
};

type Props = {
  defaultValues?: Partial<FeePlanFormValues>;

  academicYears: Option[];

  gradeLevels: Option[];

  isLoading?: boolean;

  onSubmit: (
    values: FeePlanFormValues
  ) => void;
};

export function FeePlanForm({
  defaultValues,
  academicYears,
  gradeLevels,
  onSubmit,
  isLoading = false,
}: Props) {
const {
  control,
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm<FeePlanFormValues>({
  resolver: zodResolver(feePlanSchema),
  defaultValues: {
    academicYearId: defaultValues?.academicYearId ?? 0,
    gradeLevelId: defaultValues?.gradeLevelId ?? 0,
    name: defaultValues?.name ?? "",
    baseAmount: defaultValues?.baseAmount ?? 0,
    extraServices: defaultValues?.extraServices ?? [],
  },
});
const academicYearId = watch("academicYearId");
const gradeLevelId = watch("gradeLevelId");

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,

    name: "extraServices",
  });
  
  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >
      {/* Academic Year */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Academic Year
        </label>

        <Controller
          control={control}
          name="academicYearId"
          render={({ field }) => (
            <Select
             value={
              field.value ? 
              String(
                field.value
              ) : ""
            }
              onValueChange={(
                value
              ) =>
                field.onChange(
                  Number(value)
                )
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select Academic Year" />
              </SelectTrigger>

              <SelectContent>
                {academicYears.map(
                  (year) => (
                    <SelectItem
                      key={
                        year.id
                      }
                      value={String(
                        year.id
                      )}
                    >
                      {
                        year.name
                      }
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}
        />

        {errors.academicYearId && (
          <p className="text-sm text-red-500">
            {
              errors
                .academicYearId
                .message
            }
          </p>
        )}
      </div>

      {/* Grade */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Grade Level
        </label>

        <Controller
          control={control}
          name="gradeLevelId"
          render={({ field }) => (
            <Select
              value={
                field.value
                  ? String(
                      field.value
                    )
                  : ""
              }
              onValueChange={(
                value
              ) =>
                field.onChange(
                  Number(value)
                )
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>

              <SelectContent>
                {gradeLevels.map(
                  (grade) => (
                    <SelectItem
                      key={
                        grade.id
                      }
                      value={String(
                        grade.id
                      )}
                    >
                      {
                        grade.name
                      }
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}
        />

        {errors.gradeLevelId && (
          <p className="text-sm text-red-500">
            {
              errors
                .gradeLevelId
                .message
            }
          </p>
        )}
      </div>

      {/* Name */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Fee Plan Name
        </label>

        <Input
          placeholder="Grade 7 Tuition"
          {...register(
            "name"
          )}
        />
          {errors.name && (
        <p className="text-sm text-red-500">
         {errors.name.message}
        </p>
       )}
      </div>

      {/* Amount */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Base Amount
        </label>

        <Input
         type="number"
         min={0}
         step={1}
         {...register("baseAmount", {
           valueAsNumber: true,
         })}
         />
        {errors.baseAmount && (
       <p className="text-sm text-red-500">
        {errors.baseAmount.message}
       </p>
          )}
      </div>

      {/* Extra Services */}

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold">
            Extra Services
          </h3>

          <Button
            type="button"
            variant="outline"
            disabled={!academicYearId || !gradeLevelId}
            onClick={() =>
              append({
                type: "other",
                name: "",
                amount: 0,
              })
             }
>          
            <Plus className="mr-2 h-4 w-4" />

            Add Service
          </Button>

        </div>

        {fields.map(
          (
            field,
            index
          ) => (
            <div
              key={
                field.id
              }
             className="rounded-xl border bg-muted/20 p-5 space-y-4"
            >
             {errors.extraServices?.message && (
             <p className="text-sm text-red-500">
              {errors.extraServices.message}
             </p>
             )}
              <Controller
                control={
                  control
                }
                name={`extraServices.${index}.type`}
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
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>

                      <SelectItem value="books">
                        Books
                      </SelectItem>

                      <SelectItem value="uniform">
                        Uniform
                      </SelectItem>

                      <SelectItem value="activities">
                        Activities
                      </SelectItem>

                      <SelectItem value="insurance">
                        Insurance
                      </SelectItem>

                      <SelectItem value="other">
                        Other
                      </SelectItem>

                    </SelectContent>

                  </Select>
                )}
              />

              <Input
                placeholder="Service Name"
                {...register(
                  `extraServices.${index}.name`
                )}
              />
               {errors.extraServices?.[index]?.name && (
             <p className="text-sm text-red-500">
               {errors.extraServices[index]?.name?.message}
             </p>
           )}
              <Input
                type="number"
                min={0}
                step={1}
                placeholder="Amount"
                {...register(
                  `extraServices.${index}.amount`,
                  {
                    valueAsNumber: true,
                  }
                )}
              />
            {errors.extraServices?.[index]?.amount && (
          <p className="text-sm text-red-500">
            {errors.extraServices[index]?.amount?.message}
          </p>
                )}
              <Button
               type="button"
               variant="outline"
               className="border-red-300 text-red-600 hover:bg-red-50"
               disabled={fields.length === 1}
               onClick={() => remove(index)}
             >
               <Trash2 className="mr-2 h-4 w-4" />
               Remove
             </Button>
            </div>
          )
        )}

      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading
          ? "Saving..."
          : "Save Fee Plan"}
      </Button>
    </form>
  );
}