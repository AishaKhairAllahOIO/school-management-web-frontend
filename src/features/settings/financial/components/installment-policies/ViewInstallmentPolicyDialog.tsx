import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { CalendarRange, Clock, Percent} from "lucide-react";
import type { InstallmentPolicy } from "../../types/installmentPolicy.types";

type ViewInstallmentPolicyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: InstallmentPolicy | null;
};

export function ViewInstallmentPolicyDialog({
  open,
  onOpenChange,
  policy,
}: ViewInstallmentPolicyDialogProps) {
  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-primary" />
            Installment Policy Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* الاسم */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
            <h3 className="text-lg font-semibold text-foreground">{policy.name}</h3>
          </div>

          {/* عدد الأقساط */}
          <div className="rounded-lg border border-border/50 bg-primary/[0.04] p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Total Installments</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-primary">
              {policy.items?.length || 0} Installments
            </p>
          </div>

          {/* قائمة الأقساط */}
          {policy.items && policy.items.length > 0 ? (
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                <span>Installment Breakdown</span>
              </div>
              <div className="space-y-2">
                {policy.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/[0.08] text-sm font-semibold text-primary">
                        {item.installmentNumber || index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{item.title || `Installment ${index + 1}`}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: Day {item.dueDay} of Month {item.dueMonth}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-primary">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/50 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
              No installments defined yet
            </div>
          )}

          {/* إجمالي النسب */}
          {policy.items && policy.items.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-center text-sm text-muted-foreground">
              Total: {policy.items.reduce((sum, item) => sum + (item.percentage || 0), 0)}%
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}