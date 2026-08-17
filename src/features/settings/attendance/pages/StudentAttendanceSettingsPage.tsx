import {
  RefreshCw,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

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

import { LeaveTypesSettingsPage } from "../components/LeaveTypesSettingsPage";
type ActiveSection = "students" | "staff";

type WorkspaceItem = {
  id: ActiveSection;
  title: string;
  description: string;
  icon: ReactNode;
};

const workspaceItems: WorkspaceItem[] = [
  {
    id: "students",
    title: "Students",
    description: "Set working days and required attendance",
    icon: <UserRoundCheck size={18} strokeWidth={1.8} />,
  },
  {
    id: "staff",
    title: "Staff Leave Types",
    description: "Define allowed staff leave types and work rules",
    icon: <UsersRound size={18} strokeWidth={1.8} />,
  },
];

export function StudentAttendanceSettingsPage() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("students");

  const [dialogValue, setDialogValue] = useState<
    StudentAttendanceSetting | "new" | null
  >(null);

  const [selected, setSelected] =
    useState<StudentAttendanceSetting | null>(null);

  const [pendingDelete, setPendingDelete] =
    useState<StudentAttendanceSetting | null>(null);

  const settingsQuery = useStudentAttendanceSettings();
  const termsQuery = useAcademicTerms();

  const createSetting =
    useCreateStudentAttendanceSetting();

  const updateSetting =
    useUpdateStudentAttendanceSetting();

  const deleteSetting =
    useDeleteStudentAttendanceSetting();

  const items = settingsQuery.data ?? [];
  const terms = termsQuery.data ?? [];

  const selectedTerm = useMemo(
    () =>
      terms.find(
        (term) => term.id === selected?.semesterId,
      ),
    [selected, terms],
  );

  const isLoading =
    settingsQuery.isLoading ||
    termsQuery.isLoading;

  const isError =
    settingsQuery.isError ||
    termsQuery.isError;

  const isFetching =
    settingsQuery.isFetching ||
    termsQuery.isFetching;

  if (isLoading) {
    return <StudentAttendanceSkeleton />;
  }

  if (isError) {
    return (
      <AttendanceErrorState
        isRetrying={isFetching}
        onRetry={() => {
          void Promise.all([
            settingsQuery.refetch(),
            termsQuery.refetch(),
          ]);
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <SettingsWorkspace
        items={workspaceItems}
        activeId={activeSection}
        onChange={(id) => {
          if (id === "students" || id === "staff") {
            setActiveSection(id);
          }
        }}
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

         
          </>
        ) : (
          // هنا يتم عرض صفحة تهيئة إجازات الموظفين الحقيقية بدلاً من النص المؤقت
          <LeaveTypesSettingsPage />
        )}
      </SettingsWorkspace>

      {dialogValue ? (
        <StudentAttendanceSettingDialog
          value={dialogValue}
          terms={terms}
          usedSemesterIds={items.map(
            (item) => item.semesterId,
          )}
          isPending={
            createSetting.isPending ||
            updateSetting.isPending
          }
          onClose={() => {
            if (
              !createSetting.isPending &&
              !updateSetting.isPending
            ) {
              setDialogValue(null);
            }
          }}
          onSubmit={(payload) => {
            if (dialogValue === "new") {
              createSetting.mutate(payload, {
                onSuccess: () => {
                  setDialogValue(null);
                },
              });

              return;
            }

            updateSetting.mutate(
              {
                id: dialogValue.id,
                payload,
              },
              {
                onSuccess: () => {
                  setDialogValue(null);
                },
              },
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
          if (!open && !deleteSetting.isPending) {
            setPendingDelete(null);
          }
        }}
        title="Delete attendance setting?"
        description="This semester will no longer have an attendance configuration. This action cannot be undone."
        itemName={
          pendingDelete
            ? terms
                .find(
                  (term) =>
                    term.id === pendingDelete.semesterId,
                )
                ?.semesterName.replaceAll("_", " ")
            : undefined
        }
        isPending={deleteSetting.isPending}
        onConfirm={() => {
          if (!pendingDelete) {
            return;
          }

          deleteSetting.mutate(
            pendingDelete.id,
            {
              onSuccess: () => {
                setPendingDelete(null);
              },
            },
          );
        }}
      />
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
    <div className="flex min-h-[420px] items-center justify-center px-4">
      <div className="w-full max-w-[480px] rounded-[22px] border border-destructive/20 bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[15px] bg-destructive/[0.08] text-destructive">
          <RefreshCw
            size={22}
            className={
              isRetrying
                ? "animate-spin"
                : undefined
            }
          />
        </span>

        <h2 className="mt-5 text-[17px] font-semibold text-foreground">
          Attendance settings are unavailable
        </h2>

        <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-muted-foreground">
          The configuration or academic semester
          data could not be retrieved. Check the
          server connection and try again.
        </p>

        <button
          type="button"
          disabled={isRetrying}
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              isRetrying
                ? "animate-spin"
                : undefined
            }
          />

          {isRetrying
            ? "Retrying..."
            : "Try Again"}
        </button>
      </div>
    </div>
  );
}