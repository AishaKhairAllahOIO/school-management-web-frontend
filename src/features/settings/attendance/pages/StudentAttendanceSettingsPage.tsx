import {
  CalendarCheck2,
  RefreshCw,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { ConfirmationDialog } from "@/shared/ui/confirmation-dialog";
import { SettingsWorkspace } from "@/features/settings/academic/components/shared/SettingsWorkspace";
import { SectionHeader } from "@/features/settings/academic/components/shared/SectionHeader";
import { useAcademicTerms } from "@/features/settings/academic/hooks/useAcademicSettings";

import { StudentAttendanceSettingDialog } from "../components/StudentAttendanceSettingDialog";
import { StudentAttendanceSkeleton } from "../components/StudentAttendanceSkeleton";
import { StudentAttendanceTable } from "../components/StudentAttendanceTable";
import { StudentAttendanceViewDialog } from "../components/StudentAttendanceViewDialog";
import {
  useCreateStudentAttendanceSetting,
  useDeleteStudentAttendanceSetting,
  useStudentAttendanceSettings,
  useUpdateStudentAttendanceSetting,
} from "../hooks/useStudentAttendanceSettings";
import type { StudentAttendanceSetting } from "../types/student-attendance.types";

type ActiveSection = "students" | "staff";

const workspaceItems = [
  {
    id: "students",
    title: "Students",
    description: "Set working days and required attendance",
    icon: <UserRoundCheck size={18} strokeWidth={1.75} />,
  },
  {
    id: "staff",
    title: "Staff",
    description: "Define employee attendance and work rules",
    icon: <UsersRound size={18} strokeWidth={1.75} />,
  },
] satisfies Array<{
  id: ActiveSection;
  title: string;
  description: string;
  icon: React.ReactNode;
}>;

export function StudentAttendanceSettingsPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("students");
  const [dialogValue, setDialogValue] = useState<
    StudentAttendanceSetting | "new" | null
  >(null);
  const [selected, setSelected] = useState<StudentAttendanceSetting | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<StudentAttendanceSetting | null>(null);

  const settingsQuery = useStudentAttendanceSettings();
  const termsQuery = useAcademicTerms();
  const createSetting = useCreateStudentAttendanceSetting();
  const updateSetting = useUpdateStudentAttendanceSetting();
  const deleteSetting = useDeleteStudentAttendanceSetting();

  const items = settingsQuery.data ?? [];
  const terms = termsQuery.data ?? [];
  const selectedTerm = useMemo(
    () => terms.find((term) => term.id === selected?.semesterId),
    [selected, terms],
  );

  const isLoading = settingsQuery.isLoading || termsQuery.isLoading;
  const isError = settingsQuery.isError || termsQuery.isError;
  const isFetching = settingsQuery.isFetching || termsQuery.isFetching;

  if (isLoading) return <StudentAttendanceSkeleton />;

  if (isError) {
    return (
      <AttendanceErrorState
        isRetrying={isFetching}
        onRetry={() => {
          void settingsQuery.refetch();
          void termsQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <SettingsWorkspace
        items={workspaceItems}
        activeId={activeSection}
        onChange={(id) => setActiveSection(id as ActiveSection)}
        hint="Attendance rules are used to calculate eligibility, absence rates and semester attendance summaries."
      >
        {activeSection === "students" ? (
          <>
            <SectionHeader
              title="Student Attendance"
              description="Set the expected working days and minimum attendance percentage used to evaluate students in each academic term."
              actionLabel="Add Setting"
              onAction={() => setDialogValue("new")}
            />

            <StudentAttendanceTable
              items={items}
              terms={terms}
              onView={setSelected}
              onEdit={setDialogValue}
              onDelete={setPendingDelete}
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <SummaryCard
                value={items.length}
                label="Configured Semesters"
                description="Semesters with attendance rules"
              />
              <SummaryCard
                value={
                  items.length
                    ? `${Math.round(
                        items.reduce(
                          (sum, item) => sum + item.requiredAttendancePercentage,
                          0,
                        ) / items.length,
                      )}%`
                    : "—"
                }
                label="Average Requirement"
                description="Across configured semesters"
              />
              <SummaryCard
                value={
                  items.length
                    ? Math.round(
                        items.reduce((sum, item) => sum + item.workingDays, 0) /
                          items.length,
                      )
                    : "—"
                }
                label="Average Working Days"
                description="Per configured semester"
              />
            </div>
          </>
        ) : (
          <StaffAttendancePlaceholder />
        )}
      </SettingsWorkspace>

      {dialogValue ? (
        <StudentAttendanceSettingDialog
          value={dialogValue}
          terms={terms}
          usedSemesterIds={items.map((item) => item.semesterId)}
          isPending={createSetting.isPending || updateSetting.isPending}
          onClose={() => setDialogValue(null)}
          onSubmit={(payload) => {
            if (dialogValue === "new") {
              createSetting.mutate(payload, {
                onSuccess: () => setDialogValue(null),
              });
              return;
            }

            updateSetting.mutate(
              { id: dialogValue.id, payload },
              { onSuccess: () => setDialogValue(null) },
            );
          }}
        />
      ) : null}

      <StudentAttendanceViewDialog
        item={selected}
        term={selectedTerm}
        onClose={() => setSelected(null)}
      />

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Delete attendance setting?"
        description="This semester will no longer have an attendance configuration. This action cannot be undone."
        itemName={
          pendingDelete
            ? terms
                .find((term) => term.id === pendingDelete.semesterId)
                ?.semesterName.replaceAll("_", " ")
            : undefined
        }
        isPending={deleteSetting.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteSetting.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </div>
  );
}

function StaffAttendancePlaceholder() {
  return (
    <div>
      <SectionHeader
        title="Staff Attendance"
        description="Configure the workday and attendance rules used to evaluate employee presence, absence and payroll-related attendance."
      />

      <div className="rounded-[22px] border border-dashed border-primary/20 bg-primary/[0.025] px-6 py-14 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary/[0.08] text-primary">
          <UsersRound size={24} strokeWidth={1.7} />
        </span>
        <h3 className="mt-5 text-[17px] font-medium text-foreground">
          Staff attendance configuration is not connected yet
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-6 text-muted-foreground">
          No temporary data has been added. Once the staff attendance endpoints are available, this area will use the same clear tables, forms and confirmation dialogs as student attendance.
        </p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-3.5 py-2 text-[12px] font-medium text-primary">
          <CalendarCheck2 size={15} />
          Waiting for staff attendance API
        </span>
      </div>
    </div>
  );
}

function SummaryCard({
  value,
  label,
  description,
}: {
  value: number | string;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-[18px] border border-border/55 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-[0_10px_26px_rgba(30,20,70,0.05)]">
      <p className="text-[20px] font-semibold tracking-[-0.025em] text-foreground">
        {value}
      </p>
      <p className="mt-1 text-[13px] font-medium text-foreground">{label}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
    </div>
  );
}

function AttendanceErrorState({
  isRetrying,
  onRetry,
}: {
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="rounded-[24px] border border-destructive/20 bg-card p-8 text-center shadow-soft">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-destructive/10 text-destructive">
          <CalendarCheck2 size={24} />
        </span>
        <h1 className="mt-5 text-xl font-semibold text-foreground">
          Attendance settings are unavailable
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-[14px] leading-6 text-muted-foreground">
          The configuration or academic semester data could not be retrieved.
          Check the server connection and try again.
        </p>
        <button
          type="button"
          disabled={isRetrying}
          onClick={onRetry}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-primary px-5 text-[14px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={isRetrying ? "animate-spin" : undefined}
          />
          Try Again
        </button>
      </div>
    </div>
  );
}
