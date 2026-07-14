import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  extraServiceSchema,
  type ExtraServiceFormValues,
} from "../../schemas/extraService.schema";

type Props = {
  defaultValues?: Partial<ExtraServiceFormValues>;
  feePlans: { id: string; name: string }[];
  isLoading?: boolean;
  onSubmit: (values: ExtraServiceFormValues) => void;
};

export function ExtraServiceForm({ defaultValues, feePlans, isLoading = false, onSubmit }: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExtraServiceFormValues>({
    resolver: zodResolver(extraServiceSchema),
    defaultValues: {
      feePlanId: defaultValues?.feePlanId ?? "",
      type: defaultValues?.type ?? "other",
      name: defaultValues?.name ?? "",
      amount: defaultValues?.amount ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Fee Plan</label>
        <Controller
          control={control}
          name="feePlanId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background">
                <SelectValue placeholder="Select fee plan" />
              </SelectTrigger>
              <SelectContent>
                {feePlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.feePlanId && <p className="text-sm text-red-500">{errors.feePlanId.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Type</label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {(["uniform", "books", "activities", "insurance", "other"] as const).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Service Name</label>
        <Input placeholder="Uniform" className="h-11 rounded-xl border-border/70 bg-background" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Amount</label>
        <Input type="number" className="h-11 rounded-xl border-border/70 bg-background" {...register("amount")} />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-2xl bg-violet-600 text-white shadow-sm hover:bg-violet-700">
        {isLoading ? "Saving..." : <><Plus className="mr-2 h-4 w-4" /> Save Service</>}
      </Button>
    </form>
  );
}
