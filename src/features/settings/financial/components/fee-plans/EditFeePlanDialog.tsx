import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { FeePlanForm } from "./FeePlanForm";

import type { FeePlanFormValues } from "../../schemas/feePlan.schema";

type Option = {
  id: number;
  name: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: FeePlanFormValues;
  academicYears: Option[];
  gradeLevels: Option[];
  isLoading?: boolean;
  onSubmit: (values: FeePlanFormValues) => void;
};

export function EditFeePlanDialog({
  open,
  onOpenChange,
  defaultValues,
  academicYears,
  gradeLevels,
  onSubmit,
  isLoading,
}: Props) {
  function handleSubmit(values: FeePlanFormValues) {
    onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Fee Plan</DialogTitle>
          <DialogDescription>
            Update the selected fee plan.
          </DialogDescription>
        </DialogHeader>

        <FeePlanForm
          defaultValues={defaultValues}
          academicYears={academicYears}
          gradeLevels={gradeLevels}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}