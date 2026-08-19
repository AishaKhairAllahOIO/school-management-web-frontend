import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Edit } from "lucide-react";
import type { StaffAttendanceStatus, AbsenceType } from "../types/staffAttendance.types";
import { useUpdateStaffAttendance } from "../hooks/useStaffAttendance";
import { useState } from "react";

interface AttendanceItem {
  id: string | number;
  status: string;
  absence_type?: string | null;
  [key: string]: any;
}

interface EditProps {
  attendance: AttendanceItem;
}

export const EditStaffAttendanceDialog = ({ attendance }: EditProps) => {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateStaffAttendance();

  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      status: (attendance.status || "present") as StaffAttendanceStatus,
      absence_type: (attendance.absence_type || "") as AbsenceType | "",
    },
  });

  const status = watch("status");

  const onSubmit = async (values: any) => {
    try {
      await updateMutation.mutateAsync({
        id: attendance.id,
        payload: {
          status: values.status,
          absence_type: values.status === "present" ? null : (values.absence_type || null),
        },
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update attendance", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-[10px] border-border/60 text-primary hover:bg-primary/10">
          <Edit size={15} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-[24px] bg-card text-card-foreground border-border p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-extrabold text-foreground">Edit Attendance</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-[12.5px] font-semibold text-foreground">Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as StaffAttendanceStatus)}
            >
              <SelectTrigger className="h-11 rounded-[12px] border-border bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="partial_absence">Partial Absence</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(status === "absent" || status === "partial_absence") && (
            <div className="space-y-1.5">
              <Label className="text-[12.5px] font-semibold text-foreground">Absence Type</Label>
              <Select
                value={watch("absence_type")}
                onValueChange={(value) => setValue("absence_type", value as AbsenceType)}
              >
                <SelectTrigger className="h-11 rounded-[12px] border-border bg-background text-foreground">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excused">Excused</SelectItem>
                  <SelectItem value="unexcused">Unexcused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full h-11 rounded-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[13.5px] mt-4" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
