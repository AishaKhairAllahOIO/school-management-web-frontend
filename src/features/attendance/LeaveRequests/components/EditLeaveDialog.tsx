import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { useUpdateStaffLeave } from "../hooks/useStaffLeaves";

interface Props {
  leave: any;
}

function normalizeApiDate(value?: string | null) {
  if (!value) return "";

  return value.split("T")[0];
}

export function EditLeaveDialog({ leave }: Props) {
  const [open, setOpen] = useState(false);

  const [startDate, setStartDate] = useState(
    normalizeApiDate(leave?.start_date),
  );

  const [endDate, setEndDate] = useState(
    normalizeApiDate(leave?.end_date),
  );

  const updateMutation = useUpdateStaffLeave();

  useEffect(() => {
    if (!open) return;

    setStartDate(normalizeApiDate(leave?.start_date));
    setEndDate(normalizeApiDate(leave?.end_date));
  }, [open, leave]);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

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
          className="h-8 w-8 rounded-[10px] border-info/25 text-info transition-colors hover:bg-info/10"
          title="Edit Vacation"
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-[24px] border-border/70 bg-card p-0 text-card-foreground shadow-2xl sm:max-w-[460px]">
        <DialogHeader className="border-b border-border/60 bg-muted/20 px-6 py-4">
          <DialogTitle className="text-[17px] font-semibold tracking-tight text-foreground">
            Edit Vacation Dates
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleUpdate}
          className="space-y-5 px-6 pb-6 pt-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DatePicker
              label="Start date"
              value={startDate}
              onChange={setStartDate}
              placeholder="Select start date"
              className="w-full"
              required
            />

            <DatePicker
              label="End date"
              value={endDate}
              onChange={setEndDate}
              min={startDate || undefined}
              placeholder="Select end date"
              className="w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-10 rounded-[12px] border-border px-4 text-[13px] font-medium"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !startDate ||
                !endDate ||
                updateMutation.isPending
              }
              className="h-10 rounded-[12px] bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {updateMutation.isPending
                ? "Saving..."
                : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}