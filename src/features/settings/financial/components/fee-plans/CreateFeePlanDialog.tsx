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

  academicYears: Option[];

  gradeLevels: Option[];

  isLoading?: boolean;

  onSubmit: (
    values: FeePlanFormValues
  ) => void;
};

export function CreateFeePlanDialog({
  open,
  onOpenChange,
  academicYears,
  gradeLevels,
  onSubmit,
  isLoading,
}: Props) {
  function handleSubmit(
    values: FeePlanFormValues
  ) {
    onSubmit(values);

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Create Fee Plan
          </DialogTitle>

          <DialogDescription>
            Create a tuition fee configuration.
          </DialogDescription>
        </DialogHeader>

        <FeePlanForm
          academicYears={academicYears}
          gradeLevels={gradeLevels}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}