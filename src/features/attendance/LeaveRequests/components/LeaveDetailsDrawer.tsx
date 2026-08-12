import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import type { StaffLeave } from "../../staff/types/staffAttendance.types";
import { Button } from "@/shared/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave?: StaffLeave;
}

export const LeaveDetailsDrawer = ({
  open,
  onOpenChange,
  leave,
}: Props) => {
  if (!leave) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        className="
          w-[500px]
          sm:max-w-[500px]
          overflow-y-auto
        "
      >
        <SheetHeader>
          <SheetTitle>
            Staff ID: {leave.staff_id}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="rounded-3xl border bg-background p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {leave.staff_id}
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Staff #{leave.staff_id}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Academic Year ID: {leave.academic_year_id}
                </p>
              </div>
            </div>
          </div>

          <div className="soft-card rounded-2xl p-4">
            <h4 className="font-semibold mb-3">
              Current Request
            </h4>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Type:</strong> {leave.leave_type?.name} ({leave.leave_type?.payment_type})
              </p>
              <p>
                <strong>From:</strong> {leave.start_date}
              </p>
              <p>
                <strong>To:</strong> {leave.end_date}
              </p>
              <p>
                <strong>Created At:</strong> {leave.created_at}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};