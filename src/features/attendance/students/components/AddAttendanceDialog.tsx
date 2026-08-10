import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export const AddAttendanceDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-[13px] px-5 shadow-none">
          <Plus className="me-2 h-4 w-4" />
          Add Attendance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student Attendance</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground">
          Attendance is usually bulk updated using the table below. This specific dialog can be used if you want to record an entry for a specific missing student manually.
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};