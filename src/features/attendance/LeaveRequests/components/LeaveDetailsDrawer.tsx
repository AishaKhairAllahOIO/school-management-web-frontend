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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Staff ID: {leave.staff_id}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="rounded-3xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {leave.staff_id}
              </div>
              <div>
                <h2 className="text-xl font-bold">Staff #{leave.staff_id}</h2>
                <p className="text-xs text-muted-foreground">
                  Academic Year ID: {leave.academic_year_id}
                </p>
              </div>
            </div>
          </div>

          <div className="soft-card rounded-2xl border bg-muted/20 p-5">
            <h4 className="font-semibold mb-4 text-foreground">Current Request</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">
                  {leave.leave_type?.name || "N/A"} {leave.leave_type?.payment_type ? `(${leave.leave_type.payment_type})` : ""}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">From:</span>
                <span className="font-medium">{leave.start_date}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">To:</span>
                <span className="font-medium">{leave.end_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                {/* ✅ استخدام as any لتجنب إيرور التايب سكريبت وإعطاء قيمة افتراضية */}
                <span className="font-medium text-primary">{(leave as any).status || "Pending"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Close Details
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};