import { useState } from "react";
import { Bell, Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { MultiSelectAudience, type OptionItem } from "../shared/MultiSelectAudience";
import { useAlerts } from "../../hooks/useAlerts";

type AlertCategory = "payment" | "payed" | "behavior" | "escape" | "late" | "absence" | "salary";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetAudience: "student" | "staff";
  audienceList: OptionItem[];
  isLoadingAudience?: boolean;
};

export function SendBulkAlertDialog({
  open,
  onOpenChange,
  targetAudience,
  audienceList = [],
  isLoadingAudience = false,
}: Props) {
  const { sendPaymentAlert, sendAdvisorAlert, sendStaffAlert, isSending } = useAlerts();

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [alertType, setAlertType] = useState<AlertCategory>(
    targetAudience === "student" ? "absence" : "salary"
  );

  const [amount, setAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [sessionName, setSessionName] = useState<string>("");
  const [minutesLate, setMinutesLate] = useState<string>("15");
  const [monthName, setMonthName] = useState<string>("June 2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("الرجاء اختيار شخص واحد على الأقل لإرسال التنبيه.");
      return;
    }

    if (targetAudience === "staff") {
      if (alertType === "salary" || alertType === "absence" || alertType === "late") {
        sendStaffAlert.mutate(
          {
            audience: "staff",
            type: alertType as "salary" | "absence" | "late",
            staff_ids: selectedIds,
            meta:
              alertType === "salary"
                ? { amount: Number(amount) || 0, mounth: monthName }
                : alertType === "late"
                ? { session: sessionName, minutes_late: Number(minutesLate) || 0 }
                : undefined,
          },
          { onSuccess: handleSuccess }
        );
      }
      return;
    }

    if (alertType === "payed" || alertType === "payment") {
      sendPaymentAlert.mutate(
        {
          audience: "student",
          type: alertType,
          enrollement_ids: selectedIds,
          meta:
            alertType === "payed"
              ? { amount: Number(amount) || 0 }
              : { amount_due: Number(amount) || 0, due_date: dueDate },
        },
        { onSuccess: handleSuccess }
      );
      return;
    }

    sendAdvisorAlert.mutate(
      {
        audience: "student",
        type: alertType as "behavior" | "escape" | "late" | "absence",
        enrollement_ids: selectedIds,
        meta:
          alertType === "behavior"
            ? { severity }
            : alertType === "escape"
            ? { session: sessionName }
            : alertType === "late"
            ? { session: sessionName, minutes_late: Number(minutesLate) || 0 }
            : undefined,
      },
      { onSuccess: handleSuccess }
    );
  };

  const handleSuccess = () => {
    alert("تم إرسال التنبيهات بنجاح!");
    setSelectedIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground border-border shadow-floating">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Bell className="w-5 h-5 text-primary" />
            إرسال تنبيه جماعي ({targetAudience === "student" ? "للطلاب" : "للموظفين"})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-3">
          <MultiSelectAudience
            label={targetAudience === "student" ? "اختر الطلاب المستهدفين" : "اختر الموظفين"}
            placeholder="ابحث بالاسم..."
            options={audienceList}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            isLoading={isLoadingAudience}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">نوع التنبيه</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as AlertCategory)}
              className="w-full rounded-xl border border-input bg-card text-foreground p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {targetAudience === "student" ? (
                <>
                  <option value="absence">تنبيه غياب (Absence)</option>
                  <option value="late">تنبيه تأخر عن الحصة (Late)</option>
                  <option value="escape">تنبيه هروب من الدوام (Escape)</option>
                  <option value="behavior">تنبيه سلوكي (Behavior)</option>
                  <option value="payment">تنبيه بدفعة مستحقة (Payment Due)</option>
                  <option value="payed">تأكيد استلام دفعة (Payment Received)</option>
                </>
              ) : (
                <>
                  <option value="salary">إشعار نزول الراتب (Salary)</option>
                  <option value="absence">تنبيه غياب موظف (Absence)</option>
                  <option value="late">تنبيه تأخر موظف (Late)</option>
                </>
              )}
            </select>
          </div>

          {/* Dynamic Meta Form Container */}
          <div className="p-3.5 bg-muted/50 rounded-xl border border-border space-y-3 animate-in fade-in duration-200">
            {(alertType === "salary" || alertType === "payment" || alertType === "payed") && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">المبلغ ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="مثال: 25000"
                  required
                  className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
            )}

            {alertType === "salary" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">عن شهر</label>
                <input
                  type="text"
                  value={monthName}
                  onChange={(e) => setMonthName(e.target.value)}
                  placeholder="مثال: June 2026"
                  required
                  className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
            )}

            {alertType === "payment" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">تاريخ الاستحقاق</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
            )}

            {alertType === "behavior" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">درجة المخالفة</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
                >
                  <option value="low">منخفضة (Low)</option>
                  <option value="medium">متوسطة (Medium)</option>
                  <option value="high">شديدة (High)</option>
                </select>
              </div>
            )}

            {(alertType === "escape" || alertType === "late") && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">اسم الحصة / المادة</label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="مثال: Math Session"
                  required
                  className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
            )}

            {alertType === "late" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">مدة التأخر (بالدقائق)</label>
                <input
                  type="number"
                  value={minutesLate}
                  onChange={(e) => setMinutesLate(e.target.value)}
                  placeholder="15"
                  required
                  className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
                />
              </div>
            )}

            {alertType === "absence" && (
              <p className="text-xs text-muted-foreground text-center">لا توجد تفاصيل إضافية مطلوبة لهذا التنبيه.</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSending || selectedIds.length === 0}
              className="primary-gradient text-primary-foreground gap-2"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              إرسال التنبيه ({selectedIds.length})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}