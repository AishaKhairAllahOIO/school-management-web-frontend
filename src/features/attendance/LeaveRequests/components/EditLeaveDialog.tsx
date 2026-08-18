import { useState, useEffect } from "react";
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
import { useUpdateStaffLeave } from "../hooks/useStaffLeaves";

interface Props {
  leave: any;
}

export function EditLeaveDialog({ leave }: Props) {
  const [open, setOpen] = useState(false);
  
  const initialStart = leave?.start_date?.split("T")[0] || "";
  const initialEnd = leave?.end_date?.split("T")[0] || "";

  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  
  const updateMutation = useUpdateStaffLeave();

  useEffect(() => {
    if (open) {
      setStartDate(leave?.start_date?.split("T")[0] || "");
      setEndDate(leave?.end_date?.split("T")[0] || "");
    }
  }, [open, leave]);

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
          className="h-8 w-8 rounded-[10px] border-info/25 text-info hover:bg-info/10 transition-colors"
          title="Edit Vacation"
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] rounded-[24px] bg-card text-card-foreground border-border p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[18px] font-extrabold text-foreground">Edit Vacation Dates</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleUpdate} className="space-y-4 mt-2">
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12.5px] font-semibold text-foreground">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 rounded-[12px] border-border bg-background text-[12.5px] text-foreground"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-[12.5px] font-semibold text-foreground">End Date</Label>
              <Input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-11 rounded-[12px] border-border bg-background text-[12.5px] text-foreground"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/60 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="h-10 rounded-[12px] border-border"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="h-10 rounded-[12px] bg-info hover:bg-info/90 text-white font-semibold px-5"
            >
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}