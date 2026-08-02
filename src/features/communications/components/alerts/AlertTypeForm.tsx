import { AlertTriangle } from "lucide-react";

export type AlertCategory = "payment" | "payed" | "behavior" | "escape" | "late" | "absence" | "salary";

type Props = {
  audience: "student" | "staff";
  alertType: AlertCategory;
  onAlertTypeChange: (value: AlertCategory) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  dueDate: string;
  onDueDateChange: (value: string) => void;
  severity: "low" | "medium" | "high";
  onSeverityChange: (value: "low" | "medium" | "high") => void;
  sessionName: string;
  onSessionNameChange: (value: string) => void;
  minutesLate: string;
  onMinutesLateChange: (value: string) => void;
  monthName: string;
  onMonthNameChange: (value: string) => void;
};

export function AlertTypeForm({
  audience,
  alertType,
  onAlertTypeChange,
  amount,
  onAmountChange,
  dueDate,
  onDueDateChange,
  severity,
  onSeverityChange,
  sessionName,
  onSessionNameChange,
  minutesLate,
  onMinutesLateChange,
  monthName,
  onMonthNameChange,
}: Props) {
  const isStudent = audience === "student";

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">نوع التنبيه</label>
        <select
          value={alertType}
          onChange={(e) => onAlertTypeChange(e.target.value as AlertCategory)}
          className="w-full rounded-xl border border-input bg-card text-foreground p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {isStudent ? (
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

      <div className="p-3.5 bg-muted/50 rounded-xl border border-border space-y-3 animate-in fade-in duration-200">
        {(alertType === "salary" || alertType === "payment" || alertType === "payed") && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">المبلغ</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
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
              onChange={(e) => onMonthNameChange(e.target.value)}
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
              onChange={(e) => onDueDateChange(e.target.value)}
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
              onChange={(e) => onSeverityChange(e.target.value as "low" | "medium" | "high")}
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
              onChange={(e) => onSessionNameChange(e.target.value)}
              placeholder="مثال: رياضيات"
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
              onChange={(e) => onMinutesLateChange(e.target.value)}
              placeholder="15"
              required
              className="w-full rounded-lg border border-input p-2 text-sm bg-card text-foreground focus:ring-1 focus:ring-ring outline-none"
            />
          </div>
        )}

        {alertType === "absence" && (
          <div className="rounded-lg border border-dashed border-border bg-card/60 p-3 text-sm text-muted-foreground flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-warning" />
            <span>لا توجد تفاصيل إضافية مطلوبة لهذا التنبيه، وسيتم الإرسال مباشرةً مع قائمة المستهدفين.</span>
          </div>
        )}
      </div>
    </div>
  );
}
