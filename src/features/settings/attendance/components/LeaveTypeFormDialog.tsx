
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import {
  BaseDialog,
  DialogActions,
  DialogField,
  dialogInputClass,
} from "@/features/settings/academic/components/dialogs/BaseDialog";

import {
  useCreateLeaveType,
  useUpdateLeaveType,
} from "../hooks/useLeaveTypes";

import type {
  LeaveType,
  CreateLeaveTypePayload,
} from "../types/leaveType.types";

interface LeaveTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveTypeToEdit?: LeaveType | null;
}

export const LeaveTypeFormDialog = ({
  open,
  onOpenChange,
  leaveTypeToEdit,
}: LeaveTypeFormDialogProps) => {
  const [name, setName] = useState("");
  const [paymentType, setPaymentType] =
    useState<"paid" | "unpaid">("paid");
  const [maxDays, setMaxDays] = useState<number>(10);

  const createMutation = useCreateLeaveType();
  const updateMutation = useUpdateLeaveType();

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  /*
   * Keep the original form initialization logic.
   *
   * New:
   * - Reset the form to defaults.
   *
   * Edit:
   * - Load the selected leave type.
   *
   * The `open` dependency ensures the form is refreshed
   * every time the dialog is opened.
   */
  useEffect(() => {
    if (!open) return;

    if (leaveTypeToEdit) {
      setName(leaveTypeToEdit.name);
      setPaymentType(leaveTypeToEdit.payment_type);
      setMaxDays(
        leaveTypeToEdit.max_days_per_academic_year,
      );
    } else {
      setName("");
      setPaymentType("paid");
      setMaxDays(10);
    }
  }, [leaveTypeToEdit, open]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const payload: CreateLeaveTypePayload = {
      name: name.trim(),
      payment_type: paymentType,
      max_days_per_academic_year: Number(maxDays),
    };

    try {
      if (leaveTypeToEdit) {
        await updateMutation.mutateAsync({
          id: leaveTypeToEdit.id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      /*
       * IMPORTANT:
       * The parent still controls the dialog state.
       */
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save leave type", error);

      if (error.response?.data?.errors) {
        console.log(
          "Validation Errors:",
          error.response.data.errors,
        );
      }
    }
  };

  /*
   * Do not mount BaseDialog while closed.
   *
   * This preserves the original controlled `open` behavior
   * because BaseDialog itself does not receive an `open` prop.
   */
  if (!open) {
    return null;
  }

  return (
    <BaseDialog
      title={
        leaveTypeToEdit
          ? "Edit leave type"
          : "Add leave type"
      }
      description="Define the leave type, payment status, and maximum allowed days per academic year."
      onClose={() => onOpenChange(false)}
    >
      <DialogField label="Leave Type Name">
        <input
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="e.g. Sick Leave, Annual Leave"
          className={dialogInputClass}
        />
      </DialogField>

      <DialogField label="Payment Type">
        <Select
          value={paymentType}
          onValueChange={(value: "paid" | "unpaid") =>
            setPaymentType(value)
          }
        >
          <SelectTrigger className="h-11 rounded-[13px] px-3.5">
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="paid">
              Paid (مدفوعة الأجر)
            </SelectItem>

            <SelectItem value="unpaid">
              Unpaid (بدون راتب)
            </SelectItem>
          </SelectContent>
        </Select>
      </DialogField>

      <DialogField label="Max Days Per Academic Year">
        <input
          type="number"
          min={1}
          value={maxDays}
          onChange={(event) =>
            setMaxDays(Number(event.target.value))
          }
          placeholder="e.g. 30"
          className={dialogInputClass}
        />
      </DialogField>

      <div className="rounded-[15px] border border-primary/10 bg-primary/[0.035] px-4 py-3">
        <p className="text-[12px] leading-5 text-muted-foreground">
          Set the maximum number of days employees can use
          for this leave type during the academic year.
        </p>
      </div>

      <DialogActions
        onClose={() => onOpenChange(false)}
        onSave={handleSubmit}
        disabled={
          isPending ||
          !name.trim() ||
          maxDays < 1
        }
      />
    </BaseDialog>
  );
};
