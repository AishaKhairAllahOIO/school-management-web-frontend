  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { InstallmentPolicyForm } from "./InstallmentPolicyForm";

import type { InstallmentPolicyFormValues } from "../../schemas/installmentPolicy.schema";

type Props = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  defaultValues: InstallmentPolicyFormValues;

  isLoading?: boolean;

  onSubmit: (
    values: InstallmentPolicyFormValues
  ) => void;
};

export function EditInstallmentPolicyDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isLoading,
}: Props) {
  function handleSubmit(
    values: InstallmentPolicyFormValues
  ) {
    onSubmit(values);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Installment Policy
          </DialogTitle>

          <DialogDescription>
            Update installment policy information.
          </DialogDescription>
        </DialogHeader>

        <InstallmentPolicyForm
          defaultValues={defaultValues}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}