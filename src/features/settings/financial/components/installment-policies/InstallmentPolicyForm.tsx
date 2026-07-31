import {
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
  installmentPolicySchema,
  type InstallmentPolicyFormValues,
} from "../../schemas/installmentPolicy.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type Props = {
  defaultValues?: Partial<InstallmentPolicyFormValues>;
  isLoading?: boolean;
  onSubmit: (values: InstallmentPolicyFormValues) => void;
  onCancel: () => void;
};

const fieldClassName =
  "h-11 rounded-[14px] border-border/65 bg-background text-sm shadow-none focus-visible:ring-4 focus-visible:ring-primary/[0.08]";

export function InstallmentPolicyForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InstallmentPolicyFormValues>({
    resolver: zodResolver(installmentPolicySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      items: defaultValues?.items ?? [
        {
          title: "",
          percentage: 100,
          dueMonth: 9,
          dueDay: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground/80">
          Policy Name
        </label>
        <Input
          placeholder="Installment Policy"
          className={fieldClassName}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-[11px] font-medium text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <section className="overflow-hidden rounded-[18px] border border-border/55 bg-muted/[0.10]">
        <div className="flex flex-col gap-3 border-b border-border/45 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Installments
            </h3>
            <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
              Define the percentage and due date of every payment.
            </p>
          </div>

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
            className="h-9 rounded-[12px] border-border/60 bg-card px-3 text-[11px] shadow-none"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Installment
          </Button>
        </div>

        {(errors.items?.message ||
          errors.items?.root?.message) ? (
          <div className="mx-4 mt-4 rounded-[14px] border border-destructive/15 bg-destructive/[0.035] px-4 py-3 text-[11px] font-medium text-destructive">
            {errors.items?.message ||
              errors.items?.root?.message}
          </div>
        ) : null}

        <div className="space-y-3 p-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-[16px] border border-border/50 bg-card p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Installment #{index + 1}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Payment details and due date
                  </p>
                </div>

                {fields.length > 1 ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => remove(index)}
                    className="h-8 rounded-[11px] border-destructive/15 bg-destructive/[0.025] px-3 text-[11px] text-destructive shadow-none hover:bg-destructive/[0.06] hover:text-destructive"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Remove
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Title
                  </label>
                  <Input
                    placeholder="First payment"
                    className={fieldClassName}
                    {...register(`items.${index}.title`)}
                  />
                  {errors.items?.[index]?.title ? (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.items[index]?.title?.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Percentage
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Percentage"
                    className={fieldClassName}
                    {...register(`items.${index}.percentage`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.percentage ? (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.items[index]?.percentage?.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Due Month
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    placeholder="Month"
                    className={fieldClassName}
                    {...register(`items.${index}.dueMonth`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.dueMonth ? (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.items[index]?.dueMonth?.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Due Day
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    placeholder="Day"
                    className={fieldClassName}
                    {...register(`items.${index}.dueDay`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.dueDay ? (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.items[index]?.dueDay?.message}
                    </p>
                  ) : null}
                </div>
              </div>
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
