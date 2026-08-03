import {
  Bell,
  School,
  Send,
  Users,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import { useAlerts } from "../../hooks/useAlerts";
import { AlertTypeForm, type AlertCategory } from "./AlertTypeForm";
import { DialogFormSkeleton } from "../shared/DialogFormSkeleton";
import {
  MultiSelectAudience,
  type OptionItem,
} from "../shared/MultiSelectAudience";

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
  const {
    sendPaymentAlert,
    sendAdvisorAlert,
    sendStaffAlert,
    isSending,
  } = useAlerts();

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [alertType, setAlertType] = useState<AlertCategory>(
    targetAudience === "student" ? "absence" : "salary",
  );
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [sessionName, setSessionName] = useState("");
  const [minutesLate, setMinutesLate] = useState("15");
  const [monthName, setMonthName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isStudent = targetAudience === "student";
  const tone = isStudent ? "info" : "warning";
  const headerSurface = isStudent ? "bg-info/[0.04]" : "bg-warning/[0.04]";
  const iconSurface = isStudent
    ? "border-info/15 bg-info/[0.10] text-info"
    : "border-warning/15 bg-warning/[0.11] text-warning";
  const submitClassName = isStudent
    ? "bg-info text-white hover:bg-info/90"
    : "bg-warning text-white hover:bg-warning/90";
  const AudienceIcon = isStudent ? School : Users;

  useEffect(() => {
    if (open) {
      setAlertType(isStudent ? "absence" : "salary");
    }
  }, [open, isStudent]);

  function resetState() {
    setSelectedIds([]);
    setAlertType(isStudent ? "absence" : "salary");
    setAmount("");
    setDueDate("");
    setSeverity("medium");
    setSessionName("");
    setMinutesLate("15");
    setMonthName("");
    setSubjectName("");
    setFormError(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedIds.length) {
      setFormError("Choose at least one recipient before sending the alert.");
      return;
    }

    setFormError(null);
    const numericIds = selectedIds.map(Number);
    const options = {
      onSuccess: () => {
        resetState();
        onOpenChange(false);
      },
    };

    if (targetAudience === "staff") {
      sendStaffAlert.mutate(
        {
          audience: "staff",
          type: alertType as any,
          staff_ids: numericIds,
          meta:
            alertType === "salary"
              ? {
                  amount: Number(amount) || 0,
                  mounth: monthName || "Unspecified",
                }
              : alertType === "late"
                ? {
                    session: sessionName || "Unspecified",
                    minutes_late: Number(minutesLate) || 0,
                  }
                : undefined,
        },
        options,
      );
      return;
    }

    if (alertType === "payed" || alertType === "payment") {
      sendPaymentAlert.mutate(
        {
          audience: "student",
          type: alertType,
          enrollment_ids: numericIds,
          meta:
            alertType === "payed"
              ? { amount: Number(amount) || 0 }
              : {
                  amount_due: Number(amount) || 0,
                  due_date: dueDate || new Date().toISOString().slice(0, 10),
                },
        },
        options,
      );
      return;
    }

    sendAdvisorAlert.mutate(
      {
        audience: "student",
        type: alertType as any,
        enrollment_ids: numericIds,
        meta:
          alertType === "behavior"
            ? { severity }
            : alertType === "homework"
              ? {
                  subject: subjectName || "Unspecified",
                  date: dueDate || new Date().toISOString().slice(0, 10),
                }
              : alertType === "escape"
                ? { session: sessionName || "Unspecified" }
                : alertType === "late"
                  ? {
                      session: sessionName || "Unspecified",
                      minutes_late: Number(minutesLate) || 0,
                    }
                  : undefined,
      },
      options,
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetState();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-[26px] border border-border/70 bg-card p-0 shadow-[0_30px_100px_rgba(20,14,54,0.24)] sm:max-w-2xl">
        <div className={`border-b border-border/50 px-5 py-5 sm:px-6 ${headerSurface}`}>
          <DialogHeader className="text-start">
            <div className="flex items-start gap-3.5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border ${iconSurface}`}>
                <AudienceIcon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em]">
                  {isStudent ? "Notify students" : "Notify staff"}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[12px] leading-5">
                  {isStudent
                    ? "Choose enrolled students, select the situation, and send one clear school alert."
                    : "Choose staff members by name, select the staff event, and send one focused alert."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="max-h-[calc(92vh-96px)] overflow-y-auto px-5 py-5 sm:px-6">
          {isLoadingAudience ? (
            <DialogFormSkeleton rows={4} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className={`rounded-[19px] border p-4 ${isStudent ? "border-info/[0.13] bg-info/[0.025]" : "border-warning/[0.14] bg-warning/[0.025]"}`}>
                <MultiSelectAudience
                  label={isStudent ? "Student recipients" : "Staff recipients"}
                  placeholder={isStudent ? "Search student name" : "Search staff name or role"}
                  options={audienceList}
                  selectedIds={selectedIds}
                  onChange={setSelectedIds}
                  tone={tone}
                />
              </div>

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
                tone={targetAudience}
              />

              {formError ? (
                <p className="rounded-[12px] border border-destructive/15 bg-destructive/[0.055] px-3 py-2.5 text-[11px] text-destructive">
                  {formError}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 border-t border-border/50 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSending}
                  className="h-10 rounded-[12px] border-border/70 bg-transparent px-4 text-[12px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSending || selectedIds.length === 0}
                  className={`h-10 rounded-[12px] px-5 text-[12px] ${submitClassName}`}
                >
                  {isSending ? (
                    <span className="h-3 w-24 animate-pulse rounded-full bg-current/25" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send to {selectedIds.length}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
