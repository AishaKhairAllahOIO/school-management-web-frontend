// src/features/settings/financial/components/fee-plans/ViewFeePlanDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { ReceiptText, Calendar, BookOpen, DollarSign, Package } from "lucide-react";
import type { FeePlan } from "../../types/feePlan.types";

type ViewFeePlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: FeePlan | null;
};

export function ViewFeePlanDialog({ open, onOpenChange, plan }: ViewFeePlanDialogProps) {
  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-primary" />
            Fee Plan Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* الاسم */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
            <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
          </div>

          {/* المعلومات الأساسية */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/50 bg-card p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Academic Year</span>
              </div>
              <p className="mt-1 font-medium">{plan.academicYear?.name ?? "—"}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Grade Level</span>
              </div>
              <p className="mt-1 font-medium">{plan.gradeLevel?.name ?? "—"}</p>
            </div>
          </div>

          {/* المبلغ الأساسي */}
          <div className="rounded-lg border border-border/50 bg-primary/[0.04] p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Base Amount</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-primary">
              {plan.baseAmount.toLocaleString()} $
            </p>
          </div>

          {/* الخدمات الإضافية */}
          {plan.extraServices && plan.extraServices.length > 0 ? (
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Extra Services ({plan.extraServices.length})</span>
              </div>
              <div className="space-y-2">
                {plan.extraServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-3"
                  >
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Type: {service.type.replace("_", " ")}
                      </p>
                    </div>
                    <span className="font-semibold text-primary">
                      {service.amount.toLocaleString()} $
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/50 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
              No extra services added
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}