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
import { useDeleteStaffLeave } from "../hooks/useStaffLeaves";

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
          className="h-8 w-8 rounded-[10px] border-destructive/25 text-destructive hover:bg-destructive/10 transition-colors"
          title="Delete Vacation"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] rounded-[24px] bg-card text-card-foreground border-border p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-extrabold text-foreground">Delete Vacation</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <p className="text-[13px] text-muted-foreground font-medium">
            Are you sure you want to delete this vacation? This action will remove the leave record and return the staff member's status to their default schedule.
          </p>
        </div>
        
        <div className="flex justify-end gap-2.5 mt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-10 rounded-[12px] border-border">
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={deleteMutation.isPending}
            className="h-10 rounded-[12px] bg-destructive text-destructive-foreground font-semibold"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}