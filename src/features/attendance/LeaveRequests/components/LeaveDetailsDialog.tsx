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
  leave?: any;
}

export const LeaveDetailsDialog = ({ open, onOpenChange, leave }: Props) => {
  if (!leave) return null;

  const staff = leave.staffDetails || { name: `Staff #${leave.staff_id}`, role: "Employee", initials: "?" };
  const leaveName = leave.leaveTypeName || "N/A";
  const startDate = leave.start_date?.split("T")[0];
  const endDate = leave.end_date?.split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-[24px] border-border/70 bg-card text-card-foreground shadow-2xl">
        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-[17px] font-extrabold text-foreground">
              Leave Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* بطاقة معلومات الموظف */}
            <div className="flex items-center gap-4 rounded-[18px] border border-border/60 bg-muted/30 p-4 shadow-xs">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 text-[16px] font-bold text-primary border border-primary/25">
                {staff.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-[14.5px] font-bold text-foreground truncate">{staff.name}</h2>
                <p className="text-[11.5px] font-medium text-muted-foreground">{staff.role}</p>
                
              </div>
            </div>

            {/* تفاصيل الطلب */}
            <div className="rounded-[18px] border border-border/60 bg-muted/20 p-4 shadow-xs">
              <h4 className="font-bold text-[11.5px] text-muted-foreground mb-3 uppercase tracking-wider">
                Request Information
              </h4>

              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <span className="text-muted-foreground font-medium">Leave Type</span>
                  <span className="font-bold text-foreground bg-secondary px-2.5 py-0.5 rounded-[8px] border border-border/50">
                    {leaveName}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <span className="text-muted-foreground font-medium">Start Date</span>
                  <span className="font-semibold text-foreground">{startDate}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <span className="text-muted-foreground font-medium">End Date</span>
                  <span className="font-semibold text-foreground">{endDate}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <span className="font-bold text-success bg-success/15 px-2.5 py-0.5 rounded-[8px] border border-success/30">
                    {leave.status || "Approved"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الشريط السفلي للإغلاق */}
        <div className="bg-muted/40 p-4 border-t border-border/60 flex justify-end">
          <Button
            variant="outline"
            className="rounded-[12px] h-9 px-5 font-semibold border-border text-foreground hover:bg-muted"
            onClick={() => onOpenChange(false)}
          >
            Close Window
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};