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
import type { StaffAttendanceStatus, StaffAbsenceType } from "../types/staffAttendance.types";
import { useUpdateStaffAttendance } from "../hooks/useUpdateStaffAttendance";
import { useState } from "react";

interface AttendanceItem {
  id: string | number;
  status: string;
  absence_type?: string | null;
  [key: string]: any;
}

interface Props {
  attendance: AttendanceItem;
}

export const EditStaffAttendanceDialog = ({ attendance }: Props) => {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateStaffAttendance();

  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      status: (attendance.status || "present") as StaffAttendanceStatus,
      absence_type: (attendance.absence_type || "") as StaffAbsenceType | "",
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
        <Button size="icon" variant="outline">
          <Edit size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Attendance</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as StaffAttendanceStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="partial_absence">Partial Absence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(status === "absent" || status === "partial_absence") && (
            <div>
              <Label>Absence Type</Label>
              <Select
                value={watch("absence_type")}
                onValueChange={(value) => setValue("absence_type", value as StaffAbsenceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excused">Excused</SelectItem>
                  <SelectItem value="unexcused">Unexcused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};