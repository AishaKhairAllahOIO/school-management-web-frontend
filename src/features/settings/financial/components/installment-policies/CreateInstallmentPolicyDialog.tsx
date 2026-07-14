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

  onOpenChange: (
    open: boolean
  ) => void;

  isLoading?: boolean;

  onSubmit: (
    values: InstallmentPolicyFormValues
  ) => void;
};

export function CreateInstallmentPolicyDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: Props) {
  function handleSubmit(
    values: InstallmentPolicyFormValues
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
            Create Installment Policy
          </DialogTitle>

          <DialogDescription>
            Create a new installment policy.
          </DialogDescription>

        </DialogHeader>

        <InstallmentPolicyForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

      </DialogContent>
    </Dialog>
  );
}