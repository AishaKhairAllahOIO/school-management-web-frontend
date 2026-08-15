import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useUpdateStaffLeave } from "../hooks/useUpdateStaffLeave";
import type { StaffLeave } from "../../staff/types/staffAttendance.types";

interface Props {
  leave: StaffLeave;
}

export function EditLeaveDialog({ leave }: Props) {
  const [open, setOpen] = useState(false);
  
  // نضع التواريخ الحالية كقيم افتراضية
  const [startDate, setStartDate] = useState(leave.start_date);
  const [endDate, setEndDate] = useState(leave.end_date);
  
  const updateMutation = useUpdateStaffLeave();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    try {
      await updateMutation.mutateAsync({
        id: leave.id,
        payload: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update leave request", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-lg border-info/20 text-info hover:bg-info/[0.08]"
          title="Edit Vacation"
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vacation Dates</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleUpdate} className="space-y-4 mt-2">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}