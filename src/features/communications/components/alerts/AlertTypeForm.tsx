import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { DatePicker } from "../activities/date-picker";
import { MonthPicker } from "./month-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export type AlertCategory =
  | "payment"
  | "payed"
  | "behavior"
  | "escape"
  | "late"
  | "absence"
  | "salary"
  | "homework";

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
  subjectName: string;
  onSubjectNameChange: (value: string) => void;
  tone?: "student" | "staff";
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
  subjectName,
  onSubjectNameChange,
  tone = audience,
}: Props) {
  const isStudent = audience === "student";
  const surface =
    tone === "student"
      ? "border-info/[0.14] bg-info/[0.035]"
      : "border-warning/[0.16] bg-warning/[0.035]";

  // 🌟 1. توحيد كلاسات التأثير اللوني (Focus) لتشمل حالة الفتح (data-[state=open])
  const dynamicFocusClasses = tone === "student"
    ? "focus:border-info/35 focus:ring-4 focus:ring-info/[0.07] data-[state=open]:border-info/35 data-[state=open]:ring-4 data-[state=open]:ring-info/[0.07]"
    : "focus:border-warning/35 focus:ring-4 focus:ring-warning/[0.07] data-[state=open]:border-warning/35 data-[state=open]:ring-4 data-[state=open]:ring-warning/[0.07]";

  // 🌟 2. تطبيق الكلاسات على الحقول العادية
  const inputClassName = `h-11 w-full rounded-[13px] border border-input bg-background px-3.5 text-[12px] outline-none transition focus:ring-offset-0 ${dynamicFocusClasses}`;

  // 🌟 3. كلاس مخصص للـ SelectTrigger ليعمل Override للون البنفسجي الافتراضي
  const selectTriggerClassName = `h-11 w-full rounded-[13px] border-border/70 bg-background text-[12px] shadow-none outline-none transition focus:ring-offset-0 ${dynamicFocusClasses}`;

  return (
    <div className="space-y-4 relative">
      <div className="space-y-2 relative z-20">
        <label className="text-[11px] font-medium text-foreground">
          Alert category
        </label>

        <Select
          value={alertType}
          onValueChange={(value) =>
            onAlertTypeChange(value as AlertCategory)
          }
        >
          {/* 🌟 تمرير الكلاس الجديد هنا للـ Select الأساسي 🌟 */}
          <SelectTrigger className={selectTriggerClassName}>
            <SelectValue placeholder="Choose an alert category" />
          </SelectTrigger>
          <SelectContent>
            {isStudent ? (
              <>
                <SelectItem value="absence">Absence</SelectItem>
                <SelectItem value="late">Late arrival</SelectItem>
                <SelectItem value="escape">Left class</SelectItem>
                <SelectItem value="behavior">Behavior note</SelectItem>
                <SelectItem value="homework">Missing homework</SelectItem>
                <SelectItem value="payment">Payment due</SelectItem>
                <SelectItem value="payed">Payment received</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="salary">Salary deposited</SelectItem>
                <SelectItem value="absence">Staff absence</SelectItem>
                <SelectItem value="late">Late arrival</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className={`relative z-10 space-y-4 rounded-[18px] border p-4 ${surface}`}>
        {(alertType === "payment" ||
          alertType === "payed" ||
          alertType === "salary") && (
          <div className="grid gap-4 sm:grid-cols-2 items-end">
            <Field label="Amount">
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => onAmountChange(event.target.value)}
                placeholder="0.00"
                required
                className={inputClassName}
              />
            </Field>

            {alertType === "salary" ? (
              <MonthPicker
                label="Salary month"
                value={monthName}
                onChange={onMonthNameChange}
                required
              />
            ) : null}

            {alertType === "payment" ? (
              <DatePicker
                label="Due date"
                value={dueDate}
                onChange={onDueDateChange}
                required
              />
            ) : null}
          </div>
        )}

        {alertType === "behavior" ? (
          <Field label="Severity">
            <Select
              value={severity}
              onValueChange={(value) =>
                onSeverityChange(value as "low" | "medium" | "high")
              }
            >
              {/* 🌟 تمرير الكلاس الجديد هنا أيضاً لـ Select الخاص بـ Severity 🌟 */}
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        ) : null}

        {(alertType === "escape" || alertType === "late") ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Session or class">
              <input
                value={sessionName}
                onChange={(event) => onSessionNameChange(event.target.value)}
                placeholder="Example: Period 3"
                required
                className={inputClassName}
              />
            </Field>

            {alertType === "late" ? (
              <Field label="Minutes late">
                <input
                  type="number"
                  min="1"
                  value={minutesLate}
                  onChange={(event) => onMinutesLateChange(event.target.value)}
                  required
                  className={inputClassName}
                />
              </Field>
            ) : null}
          </div>
        ) : null}

        {alertType === "homework" ? (
          <div className="grid gap-4 sm:grid-cols-2 items-end">
            <Field label="Subject">
              <input
                value={subjectName}
                onChange={(event) => onSubjectNameChange(event.target.value)}
                placeholder="Subject name"
                required
                className={inputClassName}
              />
            </Field>

            <DatePicker
              label="Homework date"
              value={dueDate}
              onChange={onDueDateChange}
              required
            />
          </div>
        ) : null}

        {alertType === "absence" ? (
          <div className="flex items-start gap-2.5 rounded-[13px] border border-border/55 bg-background/80 p-3 text-[11px] leading-5 text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            No additional details are required. Select recipients and send the alert.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}