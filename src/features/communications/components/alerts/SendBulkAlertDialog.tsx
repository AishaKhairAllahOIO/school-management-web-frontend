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
    const backendMessage = err?.response?.data?.message;
    const backendErrors = err?.response?.data?.errors;
    
    const exactValidationError = backendErrors ? Object.values(backendErrors).flat()[0] : null;
    
    alert(`❌ رفض الباك إند الإرسال والسبب:\n\n[ ${exactValidationError || backendMessage || "خطأ غير معروف"} ]`);
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
            staff_ids: numericIds,
            meta:
              alertType === "salary"
                ? { amount: Number(amount) || 0, mounth: monthName || "غير محدد" }
                : alertType === "late"
                ? { session: sessionName || "غير محدد", minutes_late: Number(minutesLate) || 0 }
                : undefined,
          } as any,
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
          enrollement_ids: numericIds,
          meta:
            alertType === "payed"
              ? { amount: Number(amount) || 0 }
              : { amount_due: Number(amount) || 0, due_date: dueDate || new Date().toISOString().split("T")[0] },
        } as any,
        { onSuccess: handleSuccess, onError: handleError }
      );
      return;
    }

    sendAdvisorAlert.mutate(
      {
        audience: "student",
        type: alertType as "behavior" | "escape" | "late" | "absence",
        enrollement_ids: numericIds,
        meta:
          alertType === "behavior"
            ? { severity }
            : alertType === "escape"
            ? { session: sessionName || "غير محدد" }
            : alertType === "late"
            ? { session: sessionName || "غير محدد", minutes_late: Number(minutesLate) || 0 }
            : undefined,
      } as any,
      { onSuccess: handleSuccess, onError: handleError }
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetState();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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