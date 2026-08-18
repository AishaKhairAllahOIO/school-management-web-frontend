import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Plus } from "lucide-react";
import {
  attendanceSchema,
  type AttendanceSchema,
} from "../schemas/attendance.schema";

export const AddStaffAttendanceDialog = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      employeeName: "",
      role: "Teacher",
      date: "",
      status: "Present",
    },
  });

  const status = watch("status");

  const onSubmit = (values: AttendanceSchema) => {
    console.log(values);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Attendance
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-[24px] bg-card text-card-foreground border-border p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-extrabold text-foreground">
            Add Staff Attendance
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-[12.5px] font-semibold text-foreground">Employee Name</Label>
            <Input
              {...register("employeeName")}
              className="h-11 rounded-[12px] border-border bg-background text-foreground"
            />
            <p className="text-[12px] text-destructive font-medium">
              {errors.employeeName?.message}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12.5px] font-semibold text-foreground">Date</Label>
            <Input
              type="date"
              {...register("date")}
              className="h-11 rounded-[12px] border-border bg-background text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12.5px] font-semibold text-foreground">Role</Label>
            <Select
              value={watch("role")}
              onValueChange={(value) => setValue("role", value as any)}
            >
              <SelectTrigger className="h-11 rounded-[12px] border-border bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Secretary">Secretary</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Counselor">Counselor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12.5px] font-semibold text-foreground">Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as any)}
            >
              <SelectTrigger className="h-11 rounded-[12px] border-border bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status !== "Absent" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[12.5px] font-semibold text-foreground">Check In</Label>
                <Input
                  type="time"
                  {...register("checkIn")}
                  className="h-11 rounded-[12px] border-border bg-background text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12.5px] font-semibold text-foreground">Check Out</Label>
                <Input
                  type="time"
                  {...register("checkOut")}
                  className="h-11 rounded-[12px] border-border bg-background text-foreground"
                />
              </div>
            </div>
          )}

          {status === "Absent" && (
            <div className="space-y-1.5">
              <Label className="text-[12.5px] font-semibold text-foreground">Absence Type</Label>
              <Select
                value={watch("absenceType")}
                onValueChange={(value) => setValue("absenceType", value as any)}
              >
                <SelectTrigger className="h-11 rounded-[12px] border-border bg-background text-foreground">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excused">Excused</SelectItem>
                  <SelectItem value="Unexcused">Unexcused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-[12.5px] font-semibold text-foreground">Notes</Label>
            <Input
              {...register("notes")}
              className="h-11 rounded-[12px] border-border bg-background text-foreground"
            />
          </div>

          <Button type="submit" className="w-full h-11 rounded-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[13.5px] mt-4">
            Save Attendance
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};