import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useDeleteStaffLeave } from "../hooks/useDeleteStaffLeave";

interface Props {
  leaveId: string | number;
}

export function DeleteLeaveDialog({ leaveId }: Props) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteStaffLeave();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(leaveId);
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete leave request", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-lg border-destructive/20 text-destructive hover:bg-destructive/[0.07]"
          title="Delete Vacation"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Vacation</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this vacation? This action will remove the leave record and return the staff member's status to their default schedule.
          </p>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}