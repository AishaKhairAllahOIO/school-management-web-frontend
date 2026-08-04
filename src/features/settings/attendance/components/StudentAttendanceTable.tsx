import { CalendarOff } from "lucide-react";

import { ActionMenu } from "@/features/settings/academic/components/shared/ActionMenu";
import {
  EntityTable,
  EntityTd,
  EntityTh,
} from "@/features/settings/academic/components/shared/EntityTable";
import type { AcademicTerm } from "@/features/settings/academic/types/academic-settings.types";

import type { StudentAttendanceSetting } from "../types/student-attendance.types";
import { formatTermName } from "./StudentAttendanceSettingDialog";

type Props = {
  items: StudentAttendanceSetting[];
  terms: AcademicTerm[];
  onView: (item: StudentAttendanceSetting) => void;
  onEdit: (item: StudentAttendanceSetting) => void;
  onDelete: (item: StudentAttendanceSetting) => void;
};

export function StudentAttendanceTable({
  items,
  terms,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-border/70 bg-muted/[0.08] px-6 py-14 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary/[0.07] text-primary">
          <CalendarOff size={21} strokeWidth={1.7} />
        </span>
        <h3 className="mt-4 text-[15px] font-medium text-foreground">
          No attendance settings yet
        </h3>
        <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-5 text-muted-foreground">
          Add a semester configuration to define instructional days and the
          minimum attendance requirement.
        </p>
      </div>
    );
  }

  return (
    <EntityTable>
      <thead>
        <tr>
          <EntityTh>Semester</EntityTh>
          <EntityTh>Working Days</EntityTh>
          <EntityTh>Required Attendance</EntityTh>
          <EntityTh>Allowed Absence</EntityTh>
          <EntityTh align="right">Actions</EntityTh>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const term = terms.find((candidate) => candidate.id === item.semesterId);
          return (
            <tr key={item.id}>
              <EntityTd strong>
                <button
                  type="button"
                  onClick={() => onView(item)}
                  className="text-left transition-colors hover:text-primary"
                >
                  {term ? formatTermName(term.semesterName) : "Semester"}
                </button>
              </EntityTd>
              <EntityTd>
                <MetricBadge value={item.workingDays} suffix="days" />
              </EntityTd>
              <EntityTd>
                <PercentageBadge value={item.requiredAttendancePercentage} />
              </EntityTd>
              <EntityTd>{item.allowedAbsenceDays} days</EntityTd>
              <EntityTd align="right">
                <ActionMenu
                  isOpen={false}
                  onOpenChange={() => undefined}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              </EntityTd>
            </tr>
          );
        })}
      </tbody>
    </EntityTable>
  );
}

function MetricBadge({ value, suffix }: { value: number; suffix: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted/45 px-3 py-1.5 text-[12px] font-medium text-foreground/80">
      {value} {suffix}
    </span>
  );
}

function PercentageBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/[0.08] px-3 py-1.5 text-[12px] font-medium text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {value}%
    </span>
  );
}
