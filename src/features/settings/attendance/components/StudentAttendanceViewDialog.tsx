import { CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

import { BaseDialog } from "@/features/settings/academic/components/dialogs/BaseDialog";
import type { AcademicTerm } from "@/features/settings/academic/types/academic-settings.types";

import type { StudentAttendanceSetting } from "../types/student-attendance.types";
import { formatTermName } from "./StudentAttendanceSettingDialog";

type Props = {
  item: StudentAttendanceSetting | null;
  term?: AcademicTerm;
  onClose: () => void;
};

export function StudentAttendanceViewDialog({ item, term, onClose }: Props) {
  if (!item) return null;

  return (
    <BaseDialog
      title="Student attendance configuration"
      description="Review the rules currently applied to this semester."
      onClose={onClose}
    >
      <div className="rounded-[18px] border border-primary/10 bg-primary/[0.035] p-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Semester
        </span>
        <p className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-foreground">
          {term ? formatTermName(term.semesterName) : "Semester configuration"}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoCard
          icon={<CalendarDays size={18} />}
          label="Working Days"
          value={`${item.workingDays} days`}
        />
        <InfoCard
          icon={<ShieldCheck size={18} />}
          label="Required Attendance"
          value={`${item.requiredAttendancePercentage}%`}
        />
        <InfoCard
          icon={<Clock3 size={18} />}
          label="Allowed Absence"
          value={`${item.allowedAbsenceDays} days`}
        />
        <InfoCard
          icon={<CheckCircle2 size={18} />}
          label="Configuration"
          value="Active"
        />
      </div>
    </BaseDialog>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[17px] border border-border/55 bg-background p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-primary/[0.07] text-primary">
        {icon}
      </span>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.07em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[15px] font-medium text-foreground">{value}</p>
    </div>
  );
}
