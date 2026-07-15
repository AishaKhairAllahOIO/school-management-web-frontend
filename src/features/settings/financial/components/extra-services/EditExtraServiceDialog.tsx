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
  // التعديل هنا: تحويل نوع الـ id إلى number ليتطابق مع الـ Form
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
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