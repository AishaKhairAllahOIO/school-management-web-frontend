import {
  Controller,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

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
  onSubmit: (values: FeePlanFormValues) => void;
  onCancel: () => void;
};

const fieldClassName =
  "h-11 rounded-[14px] border-border/65 bg-background text-sm shadow-none focus-visible:ring-4 focus-visible:ring-primary/[0.08]";

export function FeePlanForm({
  defaultValues,
  academicYears,
  gradeLevels,
  onSubmit,
  onCancel,
  isLoading = false,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feePlanSchema),
    defaultValues: {
      academicYearId:
        defaultValues?.academicYearId ?? 0,
      gradeLevelId:
        defaultValues?.gradeLevelId ?? 0,
      name: defaultValues?.name ?? "",
      baseAmount:
        defaultValues?.baseAmount ?? 0,
      extraServices:
        defaultValues?.extraServices ?? [],
    },
  });

  const academicYearId = watch("academicYearId");
  const gradeLevelId = watch("gradeLevelId");

  const { fields, append, remove } =
    useFieldArray({
      control,
      name: "extraServices",
    });

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit(data as FeePlanFormValues),
      )}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/80">
            Academic Year
          </label>
          <Controller
            control={control}
            name="academicYearId"
            render={({ field }) => (
              <Select
                value={
                  field.value
                    ? String(field.value)
                    : ""
                }
                onValueChange={(value) =>
                  field.onChange(Number(value))
                }
              >
                <SelectTrigger
                  className={fieldClassName}
                >
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem
                      key={year.id}
                      value={String(year.id)}
                    >
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.academicYearId ? (
            <p className="text-[11px] font-medium text-destructive">
              {String(
                errors.academicYearId.message,
              )}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/80">
            Grade Level
          </label>
          <Controller
            control={control}
            name="gradeLevelId"
            render={({ field }) => (
              <Select
                value={
                  field.value
                    ? String(field.value)
                    : ""
                }
                onValueChange={(value) =>
                  field.onChange(Number(value))
                }
              >
                <SelectTrigger
                  className={fieldClassName}
                >
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevels.map((grade) => (
                    <SelectItem
                      key={grade.id}
                      value={String(grade.id)}
                    >
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.gradeLevelId ? (
            <p className="text-[11px] font-medium text-destructive">
              {String(errors.gradeLevelId.message)}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/80">
            Fee Plan Name
          </label>
          <Input
            placeholder="Grade 7 Tuition"
            className={fieldClassName}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-[11px] font-medium text-destructive">
              {String(errors.name.message)}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/80">
            Base Amount
          </label>
          <Input
            type="number"
            min={0}
            step={1}
            className={fieldClassName}
            {...register("baseAmount")}
          />
          {errors.baseAmount ? (
            <p className="text-[11px] font-medium text-destructive">
              {String(errors.baseAmount.message)}
            </p>
          ) : null}
        </div>
      </div>

      <section className="overflow-hidden rounded-[18px] border border-border/55 bg-muted/[0.10]">
        <div className="flex flex-col gap-3 border-b border-border/45 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Extra Services
            </h3>
            <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
              Add optional charges included with this fee plan.
            </p>
          </div>

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
            className="h-9 rounded-[12px] border-border/60 bg-card px-3 text-[11px] shadow-none"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Service
          </Button>
        </div>

        <div className="space-y-3 p-4">
          {fields.length === 0 ? (
            <div className="rounded-[15px] border border-dashed border-border/65 bg-card/60 px-4 py-7 text-center text-xs text-muted-foreground">
              No extra services have been added.
            </div>
          ) : null}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 rounded-[16px] border border-border/50 bg-card p-4 md:grid-cols-[150px_minmax(0,1fr)_150px_auto] md:items-end"
            >
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Type
                </label>
                <Controller
                  control={control}
                  name={`extraServices.${index}.type`}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={fieldClassName}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="uniform">Uniform</SelectItem>
                        <SelectItem value="activities">Activities</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Service Name
                </label>
                <Input
                  placeholder="Service name"
                  className={fieldClassName}
                  {...register(`extraServices.${index}.name`)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Amount
                </label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="0"
                  className={fieldClassName}
                  {...register(`extraServices.${index}.amount`)}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => remove(index)}
                className="h-11 rounded-[14px] border-destructive/15 bg-destructive/[0.025] px-3 text-destructive shadow-none hover:bg-destructive/[0.06] hover:text-destructive"
                aria-label={`Remove extra service ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-2.5 border-t border-border/45 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-full border border-border/65 bg-background px-4 text-[12px] font-medium text-foreground/75 transition-colors hover:bg-muted/45 hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground shadow-[0_8px_20px_rgba(98,74,180,0.16)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
