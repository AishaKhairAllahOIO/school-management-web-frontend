import { Loader2, Plus, Save, X } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Classroom } from "@/features/academics/classrooms/types/classroom.types";
import type { GradeSubject } from "@/features/academics/grade-subjects/types/grade-subject.types";
import type { TeacherAssignment } from "@/features/academics/teacher-assignments/types/teacher-assignment.types";
import type { StaffProfile } from "@/features/users/staff/types/staff.types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import type {
  ScheduleDay,
  SchedulePeriod,
} from "../types/schedule.types";

type Mode = "add" | "edit";

type Props = {
  open: boolean;
  mode: Mode;

  period?: SchedulePeriod;
  initialDay?: ScheduleDay;

  classroom: Classroom | null;

  gradeSubjects: GradeSubject[];
  assignments: TeacherAssignment[];
  teachers: StaffProfile[];

  isPending: boolean;

  onClose: () => void;

  onAdd: (payload: {
    gradeSubjectId: number;
    teacherId: number;
    teacherAssignmentId: number;
    day: ScheduleDay;
  }) => void;

  onEdit: (payload: {
    entryId: number | string;
    gradeSubjectId: number;
    teacherId: number;
  }) => void;
};

const days: {
  value: ScheduleDay;
  label: string;
}[] = [
  {
    value: "sunday",
    label: "Sunday",
  },
  {
    value: "monday",
    label: "Monday",
  },
  {
    value: "tuesday",
    label: "Tuesday",
  },
  {
    value: "wednesday",
    label: "Wednesday",
  },
  {
    value: "thursday",
    label: "Thursday",
  },
  {
    value: "friday",
    label: "Friday",
  },
  {
    value: "saturday",
    label: "Saturday",
  },
];

export function ScheduleEntryDialog({
  open,
  mode,
  period,
  initialDay,
  classroom,
  gradeSubjects,
  assignments,
  teachers,
  isPending,
  onClose,
  onAdd,
  onEdit,
}: Props) {
  const [gradeSubjectId, setGradeSubjectId] =
    useState("");

  const [teacherAssignmentId, setTeacherAssignmentId] =
    useState("");

  const [day, setDay] =
    useState<ScheduleDay>(
      initialDay ?? "sunday",
    );

  /*
   * Lock page scrolling while dialog is open.
   *
   * Important:
   * We compensate for the scrollbar width so the
   * page width does not change when body overflow
   * switches to hidden.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const body = document.body;

    const scrollY = window.scrollY;

    const scrollbarWidth =
      window.innerWidth -
      document.documentElement.clientWidth;

    const previousOverflow =
      body.style.overflow;

    const previousPosition =
      body.style.position;

    const previousTop =
      body.style.top;

    const previousWidth =
      body.style.width;

    const previousPaddingRight =
      body.style.paddingRight;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow =
        previousOverflow;

      body.style.position =
        previousPosition;

      body.style.top =
        previousTop;

      body.style.width =
        previousWidth;

      body.style.paddingRight =
        previousPaddingRight;

      window.scrollTo({
        top: scrollY,
        behavior: "instant",
      });
    };
  }, [open]);

  /*
   * Read current subject / teacher safely
   * from the schedule entry.
   */
  const currentPeriodData = useMemo(() => {
    if (!period) {
      return {
        gradeSubjectId: "",
        teacherId: "",
      };
    }

    const item = period as SchedulePeriod &
      Partial<{
        grade_subject_id:
          | number
          | string;

        teacher_id:
          | number
          | string;

        gradeSubjectId:
          | number
          | string;

        teacherId:
          | number
          | string;
      }>;

    return {
      gradeSubjectId: String(
        item.grade_subject_id ??
          item.gradeSubjectId ??
          "",
      ),

      teacherId: String(
        item.teacher_id ??
          item.teacherId ??
          "",
      ),
    };
  }, [period]);

  /*
   * Initialize state when the dialog opens.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && period) {
      setGradeSubjectId(
        currentPeriodData.gradeSubjectId,
      );

      setTeacherAssignmentId("");

      setDay(
        initialDay ?? "sunday",
      );

      return;
    }

    setGradeSubjectId("");
    setTeacherAssignmentId("");

    setDay(
      initialDay ?? "sunday",
    );
  }, [
    open,
    mode,
    period?.entry_id,
    initialDay,
    currentPeriodData.gradeSubjectId,
  ]);

  const classroomId = classroom
    ? String(classroom.id)
    : null;

  /*
   * Subjects for classroom grade.
   */
  const classroomSubjects = useMemo(() => {
    if (!classroom) {
      return [];
    }

    return gradeSubjects.filter(
      (item) =>
        String(item.gradeId) ===
        String(classroom.gradeId),
    );
  }, [
    classroom,
    gradeSubjects,
  ]);

  const selectedGradeSubject =
    classroomSubjects.find(
      (item) =>
        String(item.id) ===
        gradeSubjectId,
    );

  /*
   * Teacher assignments for:
   * classroom + selected subject.
   */
  const matchingAssignments = useMemo(() => {
    if (
      !selectedGradeSubject ||
      !classroomId
    ) {
      return [];
    }

    return assignments.filter(
      (assignment) =>
        String(
          assignment.gradeSubjectId,
        ) ===
          String(
            selectedGradeSubject.id,
          ) &&
        String(
          assignment.classroomId,
        ) === classroomId,
    );
  }, [
    assignments,
    classroomId,
    selectedGradeSubject,
  ]);

  /*
   * Auto select teacher when there is
   * exactly one assignment.
   */
  useEffect(() => {
    if (
      matchingAssignments.length === 1
    ) {
      setTeacherAssignmentId(
        String(
          matchingAssignments[0].id,
        ),
      );

      return;
    }

    if (
      !matchingAssignments.some(
        (assignment) =>
          String(assignment.id) ===
          teacherAssignmentId,
      )
    ) {
      setTeacherAssignmentId("");
    }
  }, [
    matchingAssignments,
    teacherAssignmentId,
  ]);

  /*
   * Resolve existing teacher assignment
   * when editing.
   */
  useEffect(() => {
    if (
      mode !== "edit" ||
      !selectedGradeSubject ||
      !currentPeriodData.teacherId
    ) {
      return;
    }

    const existingAssignment =
      assignments.find(
        (assignment) =>
          String(
            assignment.gradeSubjectId,
          ) ===
            String(
              selectedGradeSubject.id,
            ) &&
          String(
            assignment.classroomId,
          ) ===
            String(classroomId) &&
          String(
            assignment.teacherId,
          ) ===
            String(
              currentPeriodData.teacherId,
            ),
      );

    if (existingAssignment) {
      setTeacherAssignmentId(
        String(
          existingAssignment.id,
        ),
      );
    }
  }, [
    mode,
    selectedGradeSubject,
    assignments,
    classroomId,
    currentPeriodData.teacherId,
  ]);

  const selectedAssignment =
    matchingAssignments.find(
      (item) =>
        String(item.id) ===
        teacherAssignmentId,
    );

  const selectedTeacher =
    selectedAssignment
      ? teachers.find(
          (teacher) =>
            String(teacher.id) ===
            String(
              selectedAssignment.teacherId,
            ),
        )
      : null;

  if (!open) {
    return null;
  }

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (
      !selectedGradeSubject ||
      !selectedAssignment
    ) {
      return;
    }

    if (mode === "add") {
      onAdd({
        gradeSubjectId: Number(
          selectedGradeSubject.id,
        ),

        teacherId: Number(
          selectedAssignment.teacherId,
        ),

        teacherAssignmentId: Number(
          selectedAssignment.id,
        ),

        day,
      });

      return;
    }

    if (!period) {
      return;
    }

    onEdit({
      entryId: period.entry_id,

      gradeSubjectId: Number(
        selectedGradeSubject.id,
      ),

      teacherId: Number(
        selectedAssignment.teacherId,
      ),
    });
  }

  const canSubmit = Boolean(
    selectedGradeSubject &&
      selectedAssignment,
  );

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        p-4 sm:p-6
      "
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        disabled={isPending}
        className="
          absolute inset-0
          bg-slate-950/[0.18]
          backdrop-blur-[3px]
        "
      />

      {/* Dialog */}
      <div
        className="
          relative z-10
          w-full max-w-[480px]
          overflow-visible
          rounded-[28px]
          border border-border/50
          bg-card
          shadow-[0_28px_90px_rgba(30,20,70,0.16)]
        "
      >
        {/* Header */}
        <div
          className="
            rounded-t-[28px]
            border-b border-border/40
            bg-card
            px-5 py-4
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-[14px]
                  bg-primary/[0.09]
                  text-primary
                "
              >
                {mode === "add" ? (
                  <Plus size={18} />
                ) : (
                  <Save size={17} />
                )}
              </div>

              <div className="min-w-0">
                <h2
                  className="
                    text-[15px]
                    font-semibold
                    tracking-[-0.01em]
                  "
                >
                  {mode === "add"
                    ? "Add lesson"
                    : "Edit lesson"}
                </h2>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[11px]
                    text-muted-foreground
                  "
                >
                  {classroom?.name ??
                    "Classroom"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              aria-label="Close"
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-full
                text-muted-foreground
                transition
                hover:bg-muted/60
                hover:text-foreground
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              <X
                size={16}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="
            rounded-b-[28px]
            bg-card
            p-5
          "
        >
          <div className="space-y-4">
            {/* Subject */}
            <Field label="Subject">
              <Select
                value={gradeSubjectId}
                onValueChange={(value) => {
                  setGradeSubjectId(value);
                  setTeacherAssignmentId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>

                <SelectContent>
                  {classroomSubjects.length ===
                  0 ? (
                    <div
                      className="
                        px-3 py-2.5
                        text-[11px]
                        text-muted-foreground
                      "
                    >
                      No subjects available
                    </div>
                  ) : (
                    classroomSubjects.map(
                      (subject) => (
                        <SelectItem
                          key={subject.id}
                          value={String(
                            subject.id,
                          )}
                        >
                          {subject.subjectName ||
                            "Unnamed subject"}
                        </SelectItem>
                      ),
                    )
                  )}
                </SelectContent>
              </Select>
            </Field>

            {/* Teacher */}
            <Field label="Teacher">
              <Select
                value={
                  teacherAssignmentId
                }
                onValueChange={
                  setTeacherAssignmentId
                }
                disabled={
                  !selectedGradeSubject ||
                  matchingAssignments.length ===
                    0
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedGradeSubject
                        ? "Select subject first"
                        : matchingAssignments.length ===
                            0
                          ? "No teacher assignment"
                          : "Select teacher"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {matchingAssignments.map(
                    (assignment) => {
                      const teacher =
                        teachers.find(
                          (item) =>
                            String(
                              item.id,
                            ) ===
                            String(
                              assignment.teacherId,
                            ),
                        );

                      return (
                        <SelectItem
                          key={
                            assignment.id
                          }
                          value={String(
                            assignment.id,
                          )}
                        >
                          {teacher?.fullName ??
                            `Teacher #${assignment.teacherId}`}
                        </SelectItem>
                      );
                    },
                  )}
                </SelectContent>
              </Select>
            </Field>

            {/* Day - ADD ONLY */}
            {mode === "add" && (
              <Field label="Day">
                <Select
                  value={day}
                  onValueChange={(value) =>
                    setDay(
                      value as ScheduleDay,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>

                  <SelectContent>
                    {days.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            {/* Selected Teacher */}
            {selectedTeacher && (
              <div
                className="
                  flex items-center gap-3
                  rounded-[15px]
                  border border-sky-200/45
                  bg-sky-50/[0.55]
                  px-3.5 py-2.5
                "
              >
                <div
                  className="
                    flex h-8 w-8 shrink-0
                    items-center justify-center
                    rounded-[11px]
                    bg-sky-100
                    text-[11px]
                    font-semibold
                    text-sky-600
                  "
                >
                  {selectedTeacher.fullName
                    ?.charAt(0)
                    ?.toUpperCase() ?? "T"}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-[11px]
                      font-medium
                      text-sky-900
                    "
                  >
                    {selectedTeacher.fullName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className="
              mt-5
              flex items-center justify-end gap-2
              border-t border-border/35
              pt-4
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="
                h-9
                rounded-full
                border border-border/55
                bg-background
                px-4
                text-[11px]
                font-medium
                text-muted-foreground
                transition-all
                hover:bg-muted/50
                hover:text-foreground
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !canSubmit ||
                isPending
              }
              className="
                inline-flex h-9
                items-center gap-2
                rounded-full
                bg-primary
                px-4
                text-[11px]
                font-medium
                text-primary-foreground
                shadow-[0_6px_18px_hsl(var(--primary)/0.16)]
                transition-all
                hover:-translate-y-[1px]
                hover:opacity-90
                disabled:pointer-events-none
                disabled:opacity-45
              "
            >
              {isPending ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : mode === "add" ? (
                <Plus size={14} />
              ) : (
                <Save size={14} />
              )}

              {isPending
                ? "Saving..."
                : mode === "add"
                  ? "Add lesson"
                  : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span
        className="
          px-0.5
          text-[10px]
          font-medium
          text-muted-foreground
        "
      >
        {label}
      </span>

      {children}
    </div>
  );
}