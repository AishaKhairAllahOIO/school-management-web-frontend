import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { useCreateLeaveType, useUpdateLeaveType } from "../hooks/useLeaveTypes";
import type { LeaveType, CreateLeaveTypePayload } from "../types/leaveType.types";

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
  const [paymentType, setPaymentType] = useState<"paid" | "unpaid">("paid");
  const [maxDays, setMaxDays] = useState<number>(10);

  const createMutation = useCreateLeaveType();
  const updateMutation = useUpdateLeaveType();

  useEffect(() => {
    if (leaveTypeToEdit) {
      setName(leaveTypeToEdit.name);
      setPaymentType(leaveTypeToEdit.payment_type);
      setMaxDays(leaveTypeToEdit.max_days_per_academic_year);
    } else {
      setName("");
      setPaymentType("paid");
      setMaxDays(10);
    }
  }, [leaveTypeToEdit, open]);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save leave type", error);

      if (error.response?.data?.errors) {
        console.log("Validation Errors:", error.response.data.errors);
      }
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[22px]">
        <DialogHeader>
          <DialogTitle>
            {leaveTypeToEdit ? "Edit Leave Type" : "Add Leave Type"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sick Leave, Annual Leave"
              required
              className="h-10 rounded-[12px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground">Payment Type</label>
            <Select value={paymentType} onValueChange={(val: "paid" | "unpaid") => setPaymentType(val)}>
              <SelectTrigger className="h-10 rounded-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid (مدفوعة الأجر)</SelectItem>
                <SelectItem value="unpaid">Unpaid (بدون راتب)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground">Max Days Per Academic Year</label>
            <Input
              type="number"
              value={maxDays}
              onChange={(e) => setMaxDays(Number(e.target.value))}
              min={1}
              required
              className="h-10 rounded-[12px]"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-[12px]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="h-10 rounded-[12px]">
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};