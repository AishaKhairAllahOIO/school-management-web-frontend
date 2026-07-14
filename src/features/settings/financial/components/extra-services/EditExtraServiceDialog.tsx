import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { ExtraServiceForm } from "./ExtraServiceForm";

import type { FeePlanExtraService } from "../../types/feePlan.types";
import type { ExtraServiceFormValues } from "../../schemas/extraService.schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: FeePlanExtraService;
  feePlans: { id: string; name: string }[];
  isLoading?: boolean;
  onSubmit: (values: ExtraServiceFormValues) => void;
};

export function EditExtraServiceDialog({ open, onOpenChange, service, feePlans, isLoading, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit extra service</DialogTitle>
          <DialogDescription>Update the selected extra service.</DialogDescription>
        </DialogHeader>
        <ExtraServiceForm
          defaultValues={{
            feePlanId: service.feePlanId,
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
