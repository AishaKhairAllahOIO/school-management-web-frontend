import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave?: any; // السجل المحسن القادم من الجدول
}

export const LeaveDetailsDialog = ({ open, onOpenChange, leave }: Props) => {
  if (!leave) return null;

  const staff = leave.staffDetails || { name: `Staff #${leave.staff_id}`, role: "Employee", initials: "?" };
  const leaveName = leave.leaveTypeName || "N/A";
  const startDate = leave.start_date?.split("T")[0];
  const endDate = leave.end_date?.split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-[24px] border-border/60 shadow-2xl">
        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-extrabold text-foreground">
              Leave Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* بطاقة معلومات الموظف */}
            <div className="flex items-center gap-4 rounded-[18px] border border-border/60 bg-muted/30 p-4 shadow-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-violet-600/15 text-[18px] font-bold text-violet-700">
                {staff.initials}
              </div>
              <div className="flex flex-col">
                <h2 className="text-[16px] font-bold text-foreground">{staff.name}</h2>
                <p className="text-[12.5px] font-medium text-muted-foreground">{staff.role}</p>
                <p className="mt-1 text-[11.5px] font-semibold text-primary/70">Staff ID: #{leave.staff_id}</p>
              </div>
            </div>

            {/* تفاصيل الطلب (الكارد الداخلي) */}
            <div className="rounded-[18px] border border-border/60 bg-card p-5 shadow-sm">
              <h4 className="font-bold text-[13.5px] text-foreground mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                Request Information
              </h4>

              <div className="space-y-3.5 text-[13px]">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-muted-foreground font-medium">Leave Type</span>
                  <span className="font-bold text-foreground bg-secondary/50 px-2 py-0.5 rounded-[6px] border border-border/40">
                    {leaveName}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-muted-foreground font-medium">Start Date</span>
                  <span className="font-semibold text-foreground">{startDate}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-muted-foreground font-medium">End Date</span>
                  <span className="font-semibold text-foreground">{endDate}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-[8px]">
                    {leave.status || "Approved"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الشريط السفلي للإغلاق */}
        <div className="bg-muted/30 p-4 border-t border-border/50 flex justify-end">
          <Button
            variant="outline"
            className="rounded-[14px] h-10 px-6 font-bold border-border/80"
            onClick={() => onOpenChange(false)}
          >
            Close Window
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};