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
    resolver:
      zodResolver(
        attendanceSchema
      ),

    defaultValues: {
      employeeName: "",
      role: "Teacher",
      date: "",
      status: "Present",
    },
  });

  const status =
    watch("status");

  const onSubmit = (
    values: AttendanceSchema
  ) => {
    console.log(values);

    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="
            rounded-2xl
          "
        >
          <Plus
            className="
              mr-2
              h-4
              w-4
            "
          />

          Add Attendance
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          sm:max-w-xl
        "
      >
        <DialogHeader>
          <DialogTitle>
            Add Staff Attendance
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="
            space-y-4
          "
        >
          <div>
            <Label>
              Employee Name
            </Label>

            <Input
              {...register(
                "employeeName"
              )}
            />

            <p className="text-sm text-red-500">
              {
                errors
                  .employeeName
                  ?.message
              }
            </p>
          </div>

          <div>
            <Label>
              Date
            </Label>

            <Input
              type="date"
              {...register(
                "date"
              )}
            />
          </div>

          <div>
            <Label>
              Role
            </Label>

            <Select
              value={watch(
                "role"
              )}
              onValueChange={(
                value
              ) =>
                setValue(
                  "role",
                  value as any
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Teacher">
                  Teacher
                </SelectItem>

                <SelectItem value="Secretary">
                  Secretary
                </SelectItem>

                <SelectItem value="Supervisor">
                  Supervisor
                </SelectItem>

                <SelectItem value="Counselor">
                  Counselor
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              Status
            </Label>

            <Select
              value={watch(
                "status"
              )}
              onValueChange={(
                value
              ) =>
                setValue(
                  "status",
                  value as any
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Present">
                  Present
                </SelectItem>

                <SelectItem value="Late">
                  Late
                </SelectItem>

                <SelectItem value="Absent">
                  Absent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status !==
            "Absent" && (
            <>
              <div>
                <Label>
                  Check In
                </Label>

                <Input
                  type="time"
                  {...register(
                    "checkIn"
                  )}
                />
              </div>

              <div>
                <Label>
                  Check Out
                </Label>

                <Input
                  type="time"
                  {...register(
                    "checkOut"
                  )}
                />
              </div>
            </>
          )}

          {status ===
            "Absent" && (
            <div>
              <Label>
                Absence Type
              </Label>

              <Select
                value={watch(
                  "absenceType"
                )}
                onValueChange={(
                  value
                ) =>
                  setValue(
                    "absenceType",
                    value as any
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Excused">
                    Excused
                  </SelectItem>

                  <SelectItem value="Unexcused">
                    Unexcused
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>
              Notes
            </Label>

            <Input
              {...register(
                "notes"
              )}
            />
          </div>

          <Button
            type="submit"
            className="
              w-full
            "
          >
            Save Attendance
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};