import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteStaffAttendance } from "../hooks/useStaffAttendance";
import { useState } from "react";

interface Props {
  id: string | number;
}

export const DeleteAttendanceDialog = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteStaffAttendance();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete attendance", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Attendance</DialogTitle>
        </DialogHeader>

        <p>Are you sure you want to delete this record?</p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};