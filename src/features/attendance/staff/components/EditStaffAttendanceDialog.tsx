import { useForm } from "react-hook-form";

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

import { Edit } from "lucide-react";

import type {
  StaffAttendance,
} from "../types/staffAttendance.types";

interface Props {
  attendance: StaffAttendance;
}

export const EditStaffAttendanceDialog = ({
  attendance,
}: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    defaultValues: attendance,
  });

  const status =
    watch("status");

  const onSubmit = (
    values: any
  ) => {
    console.log(values);

    // update mutation later
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Attendance
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
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
          </div>

          <div>
            <Label>
              Date
            </Label>

            <Input
              type="date"
              {...register("date")}
            />
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
              <Input
                type="time"
                {...register(
                  "checkIn"
                )}
              />

              <Input
                type="time"
                {...register(
                  "checkOut"
                )}
              />
            </>
          )}

          <Button
            type="submit"
            className="w-full"
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};