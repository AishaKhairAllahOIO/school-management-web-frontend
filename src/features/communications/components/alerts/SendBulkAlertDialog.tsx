import { useState } from "react";
import { Bell, Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { MultiSelectAudience, type OptionItem } from "../shared/MultiSelectAudience";
import { AlertTypeForm, type AlertCategory } from "./AlertTypeForm";
import { useAlerts } from "../../hooks/useAlerts";

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

  const resetState = () => {
    setSelectedIds([]);
    setAlertType(targetAudience === "student" ? "absence" : "salary");
    setAmount("");
    setDueDate("");
    setSeverity("medium");
    setSessionName("");
    setMinutesLate("15");
    setMonthName("June 2026");
  };

  const handleSuccess = () => {
    alert("✅ تم إرسال التنبيهات الجماعية بنجاح!");
    resetState();
    onOpenChange(false);
  };

  const handleError = (err: any) => {
    console.error("❌ Alert Error Details:", err?.response?.data || err);
    if (err?.response?.status === 403) {
      alert("❌ عذراً، لا تمتلك الصلاحية الكافية لإرسال تنبيهات لهذه الفئة.");
      return;
    }
    const backendMessage = err?.response?.data?.message;
    const backendErrors = err?.response?.data?.errors;
    const exactValidationError = backendErrors ? Object.values(backendErrors).flat()[0] : null;
    alert(`❌ فشل الإرسال:\n[ ${exactValidationError || backendMessage || "حدث خطأ غير معروف"} ]`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("الرجاء اختيار شخص واحد على الأقل.");
      return;
    }

    const numericIds = selectedIds.map((id) => Number(id));

    if (targetAudience === "staff") {
      if (alertType === "salary" || alertType === "absence" || alertType === "late") {
        sendStaffAlert.mutate(
          {
            audience: "staff",
            type: alertType as "salary" | "absence" | "late",
            staff_ids: numericIds, // 👈 مصفوفة الموظفين
            meta:
              alertType === "salary"
                ? { amount: Number(amount) || 0, mounth: monthName || "غير محدد" } // 👈 mounth كما طلب الباك
                : alertType === "late"
                ? { session: sessionName || "غير محدد", minutes_late: Number(minutesLate) || 0 }
                : undefined,
          },
          { onSuccess: handleSuccess, onError: handleError }
        );
      }
      return;
    }

    if (alertType === "payed" || alertType === "payment") {
      sendPaymentAlert.mutate(
        {
          audience: "student",
          type: alertType,
          enrollment_ids: numericIds, // 👈 مصفوفة الطلاب بحرف e إضافي
          meta:
            alertType === "payed"
              ? { amount: Number(amount) || 0 }
              : { amount_due: Number(amount) || 0, due_date: dueDate || new Date().toISOString().split("T")[0] },
        },
        { onSuccess: handleSuccess, onError: handleError }
      );
      return;
    }

    sendAdvisorAlert.mutate(
      {
        audience: "student",
        type: alertType as "behavior" | "escape" | "late" | "absence",
        enrollment_ids: numericIds, // 👈 مصفوفة الطلاب بحرف e إضافي
        meta:
          alertType === "behavior"
            ? { severity }
            : alertType === "escape"
            ? { session: sessionName || "غير محدد" }
            : alertType === "late"
            ? { session: sessionName || "غير محدد", minutes_late: Number(minutesLate) || 0 }
            : undefined,
      },
      { onSuccess: handleSuccess, onError: handleError }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) resetState(); onOpenChange(nextOpen); }}>
      <DialogContent className="floating-card sm:max-w-xl rounded-3xl border border-border p-6 shadow-2xl" dir="rtl">
        <DialogHeader className="space-y-1.5 text-right">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Bell className="h-5 w-5" />
            </div>
            إرسال تنبيه جماعي ({targetAudience === "student" ? "للطلاب" : "للموظفين"})
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pr-11">
            اختر قائمة المستهدفين (يمكنك اختيار شخص أو مجموعة) وحدد نوع التنبيه.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <MultiSelectAudience
            label={targetAudience === "student" ? "اختر الطلاب المستهدفين" : "اختر الموظفين"}
            placeholder="ابحث بالاسم..."
            options={audienceList}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            isLoading={isLoadingAudience}
          />

          <AlertTypeForm
            audience={targetAudience}
            alertType={alertType}
            onAlertTypeChange={setAlertType}
            amount={amount}
            onAmountChange={setAmount}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
            severity={severity}
            onSeverityChange={setSeverity}
            sessionName={sessionName}
            onSessionNameChange={setSessionName}
            minutesLate={minutesLate}
            onMinutesLateChange={setMinutesLate}
            monthName={monthName}
            onMonthNameChange={setMonthName}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
              className="h-11 flex-1 rounded-xl border-border bg-transparent text-foreground hover:bg-muted"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSending || selectedIds.length === 0}
              className="primary-gradient h-11 flex-[2] rounded-xl font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 active:scale-[0.98] gap-2"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              إرسال التنبيه ({selectedIds.length})
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}