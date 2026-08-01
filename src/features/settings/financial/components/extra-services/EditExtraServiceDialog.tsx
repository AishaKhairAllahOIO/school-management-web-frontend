import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { ExtraServiceForm } from "./ExtraServiceForm";

import type { ExtraService } from "../../types/extraService.types";
import type { ExtraServiceFormValues } from "../../schemas/extraService.schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ExtraService;
  feePlans: { id: number; name: string }[]; 
  isLoading?: boolean;
  onSubmit: (values: ExtraServiceFormValues) => void;
};

export function EditExtraServiceDialog({
  open,
  onOpenChange,
  service,
  feePlans,
  isLoading,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[22px] border-border/60 p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border/45 px-6 py-5 text-left">
          <DialogTitle>Edit extra service</DialogTitle>
          <DialogDescription>
            Update the selected extra service.
          </DialogDescription>
        </DialogHeader>
        <ExtraServiceForm
          defaultValues={{
            feePlanId: Number(service.feePlanId),
            type: service.type,
            name: service.name,
            amount: service.amount,
          }}
          feePlans={feePlans}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}