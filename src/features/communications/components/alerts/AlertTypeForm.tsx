import { AlertTriangle } from "lucide-react";

export type AlertCategory = "payment" | "payed" | "behavior" | "escape" | "late" | "absence" | "salary" | "homework";

type Props = {
  audience: "student" | "staff";
  alertType: AlertCategory;
  onAlertTypeChange: (value: AlertCategory) => void;
  amount: string; onAmountChange: (v: string) => void;
  dueDate: string; onDueDateChange: (v: string) => void;
  severity: "low" | "medium" | "high"; onSeverityChange: (v: "low" | "medium" | "high") => void;
  sessionName: string; onSessionNameChange: (v: string) => void;
  minutesLate: string; onMinutesLateChange: (v: string) => void;
  monthName: string; onMonthNameChange: (v: string) => void;
  subjectName: string; onSubjectNameChange: (v: string) => void;
};

export function AlertTypeForm({
  audience, alertType, onAlertTypeChange, amount, onAmountChange, dueDate, onDueDateChange, severity, onSeverityChange,
  sessionName, onSessionNameChange, minutesLate, onMinutesLateChange, monthName, onMonthNameChange, subjectName, onSubjectNameChange
}: Props) {
  const isStudent = audience === "student";

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">Alert Type</label>
        <select value={alertType} onChange={(e) => onAlertTypeChange(e.target.value as AlertCategory)} className="w-full rounded-xl border border-input bg-card text-foreground p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          {isStudent ? (
            <>
              <option value="absence">Absence Alert</option>
              <option value="late">Late Arrival</option>
              <option value="escape">Class Escape</option>
              <option value="behavior">Behavioral Issue</option>
              <option value="homework">Missing Homework</option>
              <option value="payment">Payment Due</option>
              <option value="payed">Payment Received</option>
            </>
          ) : (
            <>
              <option value="salary">Salary Deposited</option>
              <option value="absence">Staff Absence</option>
              <option value="late">Staff Late Arrival</option>
            </>
          )}
        </select>
      </div>

      <div className="p-3.5 bg-muted/30 rounded-xl border border-border space-y-3">
        {/* Dynamic Fields Based on Selection */}
        {(alertType === "payment" || alertType === "payed" || alertType === "salary") && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Amount</label>
              <input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} placeholder="0.00" required className="w-full rounded-lg border border-input p-2 text-sm bg-card" />
            </div>
            {alertType === "salary" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Month</label>
                <input type="text" value={monthName} onChange={(e) => onMonthNameChange(e.target.value)} required className="w-full rounded-lg border border-input p-2 text-sm bg-card" />
              </div>
            )}
            {alertType === "payment" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => onDueDateChange(e.target.value)} required className="w-full rounded-lg border border-input p-2 text-sm bg-card" />
              </div>
            )}
          </div>
        )}

        {alertType === "behavior" && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Severity</label>
            <select value={severity} onChange={(e) => onSeverityChange(e.target.value as any)} className="w-full rounded-lg border border-input p-2 text-sm bg-card">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        )}

        {(alertType === "escape" || alertType === "late") && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Session / Class</label>
              <input type="text" value={sessionName} onChange={(e) => onSessionNameChange(e.target.value)} required className="w-full rounded-lg border border-input p-2 text-sm bg-card" />
            </div>
            {alertType === "late" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Minutes Late</label>
                <input type="number" value={minutesLate} onChange={(e) => onMinutesLateChange(e.target.value)} required className="w-full rounded-lg border border-input p-2 text-sm bg-card" />
              </div>
            )}
          </div>
        )}

        {alertType === "homework" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Subject</label>
              <input type="text" value={subjectName} onChange={(e) => onSubjectNameChange(e.target.value)} required className="w-full rounded-lg border border-input p-2 text-sm bg-card" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => onDueDateChange(e.target.value)} required className="w-full rounded-lg border border-input p-2 text-sm bg-card" />
            </div>
          </div>
        )}

        {alertType === "absence" && (
          <div className="rounded-lg border border-dashed border-border bg-card/60 p-3 text-sm text-muted-foreground flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-warning" />
            <span>No additional details required for this alert type.</span>
          </div>
        )}
      </div>
    </div>
  );
}