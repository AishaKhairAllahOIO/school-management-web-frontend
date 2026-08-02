import { useState } from "react";
import { Bell, Loader2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
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

export function SendBulkAlertDialog({ open, onOpenChange, targetAudience, audienceList = [], isLoadingAudience = false }: Props) {
  const { sendPaymentAlert, sendAdvisorAlert, sendStaffAlert, isSending } = useAlerts();

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [alertType, setAlertType] = useState<AlertCategory>(targetAudience === "student" ? "absence" : "salary");
  const [amount, setAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [sessionName, setSessionName] = useState<string>("");
  const [minutesLate, setMinutesLate] = useState<string>("15");
  const [monthName, setMonthName] = useState<string>("June 2026");
  const [subjectName, setSubjectName] = useState<string>("");

  const resetState = () => {
    setSelectedIds([]);
    setAlertType(targetAudience === "student" ? "absence" : "salary");
    setAmount("");
    setDueDate("");
    setSeverity("medium");
    setSessionName("");
    setMinutesLate("15");
    setMonthName("June 2026");
    setSubjectName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return alert("Please select at least one person.");

    const numericIds = selectedIds.map(Number);
    const successCb = { onSuccess: () => { resetState(); onOpenChange(false); } };

    if (targetAudience === "staff" && ["salary", "absence", "late"].includes(alertType)) {
      sendStaffAlert.mutate({
        audience: "staff",
        type: alertType as any,
        staff_ids: numericIds,
        meta: alertType === "salary" ? { amount: Number(amount) || 0, mounth: monthName || "Unspecified" }
            : alertType === "late" ? { session: sessionName || "Unspecified", minutes_late: Number(minutesLate) || 0 } : undefined,
      }, successCb);
      return;
    }

    if (["payed", "payment"].includes(alertType)) {
      sendPaymentAlert.mutate({
        audience: "student",
        type: alertType as any,
        enrollment_ids: numericIds,
        meta: alertType === "payed" ? { amount: Number(amount) || 0 }
            : { amount_due: Number(amount) || 0, due_date: dueDate || new Date().toISOString().split("T")[0] },
      }, successCb);
      return;
    }

    sendAdvisorAlert.mutate({
      audience: "student",
      type: alertType as any,
      enrollment_ids: numericIds,
      meta: alertType === "behavior" ? { severity }
          : alertType === "homework" ? { subject: subjectName || "Unspecified", date: dueDate || new Date().toISOString().split("T")[0] }
          : alertType === "escape" ? { session: sessionName || "Unspecified" }
          : alertType === "late" ? { session: sessionName || "Unspecified", minutes_late: Number(minutesLate) || 0 } : undefined,
    }, successCb);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) resetState(); onOpenChange(nextOpen); }}>
      <DialogContent className="floating-card sm:max-w-xl rounded-3xl border border-border p-6 shadow-2xl max-h-[85vh] overflow-y-auto" dir="ltr">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Bell className="h-5 w-5" />
            </div>
            Send Bulk Alert ({targetAudience === "student" ? "Students" : "Staff"})
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pl-11">
            Select the target audience and configure the alert details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <MultiSelectAudience
            label={targetAudience === "student" ? "Select Students" : "Select Staff Members"}
            placeholder="Search by name..."
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
            subjectName={subjectName}
            onSubjectNameChange={setSubjectName}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSending} className="h-11 flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isSending || selectedIds.length === 0} className="primary-gradient h-11 flex-[2] rounded-xl font-semibold text-primary-foreground shadow-md active:scale-[0.98]">
              {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send Alert ({selectedIds.length})
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}