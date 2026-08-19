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

interface DeleteProps {
  id: string | number;
}

export const DeleteAttendanceDialog = ({ id }: DeleteProps) => {
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
          className="h-8 w-8 rounded-[10px] border-destructive/25 text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={15} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-[24px] bg-card text-card-foreground border-border p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-extrabold text-foreground">Delete Attendance</DialogTitle>
        </DialogHeader>

        <p className="text-[13px] text-muted-foreground my-2">Are you sure you want to delete this record?</p>

        <div className="flex justify-end gap-2.5 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="h-10 rounded-[12px] border-border/70">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="h-10 rounded-[12px] bg-destructive text-destructive-foreground font-semibold">
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};