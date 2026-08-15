import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  GraduationCap,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  format,
  isBefore,
  parse,
  startOfDay,
} from "date-fns";

import { Calendar } from "@/shared/ui/date-picker";

import {
  useCreateExamSchedule,
  useDeleteExamSubject,
  useExamSetup,
  useUpdateExamSchedule,
} from "../hooks/useExamSchedule";

import type {
  AdminExam,
  ExamFormData,
  ExamFormSubject,
} from "../types/exam-schedule.types";

type GradeOption = {
  id: string | number;
  name: string;
};

interface ExamFormDialogProps {
  open: boolean;
  exam: AdminExam | null;
  grades: GradeOption[];
  onClose: () => void;
}

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

function normalizeDate(value: string): string {
  if (!value) return "";

  return value.slice(0, 10);
}

function normalizeTime(value: string): string {
  if (!value) return "";

  return value.slice(0, 5);
}

function parseDateValue(
  value: string,
): Date | undefined {
  const normalized = normalizeDate(value);

  if (!normalized) return undefined;

  const parsed = parse(
    normalized,
    "yyyy-MM-dd",
    new Date(),
  );

  return Number.isNaN(parsed.getTime())
    ? undefined
    : parsed;
}

function parseTimeValue(
  value: string,
): Date | undefined {
  const normalized = normalizeTime(value);

  if (!normalized) return undefined;

  const parsed = parse(
    normalized,
    "HH:mm",
    new Date(),
  );

  return Number.isNaN(parsed.getTime())
    ? undefined
    : parsed;
}

function isValidTimeRange(
  startTime: string,
  endTime: string,
): boolean {
  if (!startTime || !endTime) {
    return true;
  }

  const start = parseTimeValue(startTime);
  const end = parseTimeValue(endTime);

  if (!start || !end) {
    return false;
  }

  return isBefore(start, end);
}

/* ========================================================================== */
/* Main Dialog                                                                */
/* ========================================================================== */

export function ExamFormDialog({
  open,
  exam,
  grades,
  onClose,
}: ExamFormDialogProps) {
  const isEditing = Boolean(exam);

  const createMutation =
    useCreateExamSchedule();

  const updateMutation =
    useUpdateExamSchedule();

  const deleteSubjectMutation =
    useDeleteExamSubject();

  const [title, setTitle] = useState("");

  const [type, setType] =
    useState<"exam" | "quiz">("exam");

  const [gradeLevelId, setGradeLevelId] =
    useState<number | null>(null);

  const [subjects, setSubjects] = useState<
    ExamFormSubject[]
  >([]);

  const [validationError, setValidationError] =
    useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Delete state                                                             */
  /* ------------------------------------------------------------------------ */

  const [deleteSubject, setDeleteSubject] =
    useState<{
      gradeSubjectId: number;
      subjectName: string;
      examSubjectId: number | null;
    } | null>(null);

  const setupQuery =
    useExamSetup(gradeLevelId);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteSubjectMutation.isPending;

  /* ======================================================================== */
  /* Initialize                                                               */
  /* ======================================================================== */

  useEffect(() => {
    if (!open) return;

    setValidationError(null);
    setDeleteSubject(null);

    if (exam) {
      setTitle(exam.title);
      setType(exam.type);
      setGradeLevelId(exam.grade_level.id);

      setSubjects(
        exam.subjects.map((subject) => ({
          grade_subject_id:
            subject.grade_subject_id,

          exam_date:
            normalizeDate(subject.exam_date),

          start_time:
            normalizeTime(subject.start_time),

          end_time:
            normalizeTime(subject.end_time),

          syllabus:
            subject.syllabus ?? "",

          teacher_ids:
            subject.teachers.map(
              (teacher) =>
                teacher.teacher_id,
            ),
        })),
      );

      return;
    }

    setTitle("");
    setType("exam");
    setGradeLevelId(null);
    setSubjects([]);
  }, [open, exam]);

  /* ======================================================================== */
  /* Setup data                                                               */
  /* ======================================================================== */

  const setupSubjects =
    setupQuery.data ?? [];

  const selectedSubjectIds = useMemo(
    () =>
      new Set(
        subjects
          .map(
            (subject) =>
              subject.grade_subject_id,
          )
          .filter(
            (
              value,
            ): value is number =>
              typeof value === "number",
          ),
      ),
    [subjects],
  );

  /* ======================================================================== */
  /* Grade                                                                    */
  /* ======================================================================== */

  function handleGradeChange(
    value: string,
  ) {
    const id = value
      ? Number(value)
      : null;

    setGradeLevelId(id);
    setSubjects([]);
    setDeleteSubject(null);
    setValidationError(null);
  }

  /* ======================================================================== */
  /* Subjects                                                                 */
  /* ======================================================================== */

  function addSubject(
    gradeSubjectId: number,
  ) {
    const setupSubject =
      setupSubjects.find(
        (subject) =>
          subject.grade_subject_id ===
          gradeSubjectId,
      );

    if (!setupSubject) return;

    if (
      selectedSubjectIds.has(
        gradeSubjectId,
      )
    ) {
      return;
    }

    setSubjects((current) => [
      ...current,
      {
        grade_subject_id:
          gradeSubjectId,

        exam_date: "",

        start_time: "",

        end_time: "",

        syllabus: "",

        teacher_ids:
          setupSubject.auto_teachers.map(
            (teacher) =>
              teacher.teacher_id,
          ),
      },
    ]);

    setValidationError(null);
  }

  function removeSubject(
    gradeSubjectId: number,
  ) {
    const currentSubject =
      subjects.find(
        (subject) =>
          subject.grade_subject_id ===
          gradeSubjectId,
      );

    if (!currentSubject) return;

    const setupSubject =
      setupSubjects.find(
        (subject) =>
          subject.grade_subject_id ===
          gradeSubjectId,
      );

    const subjectName =
      setupSubject?.subject_name ??
      "this subject";

    /*
     * Check whether this subject already exists
     * in the saved exam.
     */
    const persistedSubject =
      exam?.subjects.find(
        (subject) =>
          subject.grade_subject_id ===
          gradeSubjectId,
      );

    /*
     * New subject:
     * remove immediately from local form.
     */
    if (!persistedSubject) {
      setSubjects((current) =>
        current.filter(
          (subject) =>
            subject.grade_subject_id !==
            gradeSubjectId,
        ),
      );

      setValidationError(null);

      return;
    }

    /*
     * Existing subject:
     * show confirmation dialog.
     */
    setDeleteSubject({
      gradeSubjectId,
      subjectName,
      examSubjectId:
        persistedSubject.exam_subject_id,
    });
  }

  function closeDeleteSubjectDialog() {
    if (
      deleteSubjectMutation.isPending
    ) {
      return;
    }

    setDeleteSubject(null);
  }

  function confirmDeleteSubject() {
    if (!deleteSubject || !exam) {
      return;
    }

    deleteSubjectMutation.mutate(
      {
        examId: exam.exam_id,
        gradeSubjectId:
          deleteSubject.gradeSubjectId,
      },
      {
        onSuccess: () => {
          setSubjects((current) =>
            current.filter(
              (subject) =>
                subject.grade_subject_id !==
                deleteSubject.gradeSubjectId,
            ),
          );

          setDeleteSubject(null);
          setValidationError(null);
        },
      },
    );
  }

  function updateSubject(
    gradeSubjectId: number,
    patch: Partial<ExamFormSubject>,
  ) {
    setSubjects((current) =>
      current.map((subject) =>
        subject.grade_subject_id ===
        gradeSubjectId
          ? {
              ...subject,
              ...patch,
            }
          : subject,
      ),
    );

    setValidationError(null);
  }

  /* ======================================================================== */
  /* Teachers                                                                 */
  /* ======================================================================== */

  function toggleTeacher(
    gradeSubjectId: number,
    teacherId: number,
  ) {
    const subject = subjects.find(
      (item) =>
        item.grade_subject_id ===
        gradeSubjectId,
    );

    if (!subject) return;

    const exists =
      subject.teacher_ids.includes(
        teacherId,
      );

    updateSubject(
      gradeSubjectId,
      {
        teacher_ids: exists
          ? subject.teacher_ids.filter(
              (id) => id !== teacherId,
            )
          : [
              ...subject.teacher_ids,
              teacherId,
            ],
      },
    );
  }

  /* ======================================================================== */
  /* Validation                                                               */
  /* ======================================================================== */

  function validateForm(): boolean {
    if (!title.trim()) {
      setValidationError(
        "Please enter an exam title.",
      );

      return false;
    }

    if (gradeLevelId === null) {
      setValidationError(
        "Please select a grade.",
      );

      return false;
    }

    if (subjects.length === 0) {
      setValidationError(
        "Please select at least one subject.",
      );

      return false;
    }

    const today =
      startOfDay(new Date());

    for (
      let index = 0;
      index < subjects.length;
      index++
    ) {
      const subject = subjects[index];

      const subjectName =
        setupSubjects.find(
          (item) =>
            item.grade_subject_id ===
            subject.grade_subject_id,
        )?.subject_name ??
        `Subject ${index + 1}`;

      if (!subject.exam_date) {
        setValidationError(
          `Please select an exam date for ${subjectName}.`,
        );

        return false;
      }

      const examDate =
        parseDateValue(
          subject.exam_date,
        );

      if (
        !examDate ||
        isBefore(
          startOfDay(examDate),
          today,
        )
      ) {
        setValidationError(
          `The exam date for ${subjectName} must be today or a future date.`,
        );

        return false;
      }

      if (!subject.start_time) {
        setValidationError(
          `Please select a start time for ${subjectName}.`,
        );

        return false;
      }

      if (!subject.end_time) {
        setValidationError(
          `Please select an end time for ${subjectName}.`,
        );

        return false;
      }

      if (
        !isValidTimeRange(
          subject.start_time,
          subject.end_time,
        )
      ) {
        setValidationError(
          `The end time must be after the start time for ${subjectName}.`,
        );

        return false;
      }
    }

    setValidationError(null);

    return true;
  }

  /* ======================================================================== */
  /* Submit                                                                   */
  /* ======================================================================== */

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (gradeLevelId === null) {
      return;
    }

    const normalizedSubjects =
      subjects.map((subject) => ({
        ...subject,

        exam_date:
          normalizeDate(
            subject.exam_date,
          ),

        start_time:
          normalizeTime(
            subject.start_time,
          ),

        end_time:
          normalizeTime(
            subject.end_time,
          ),
      }));

    const payload: ExamFormData = {
      title: title.trim(),

      type,

      grade_level_id:
        gradeLevelId,

      subjects:
        normalizedSubjects,
    };

    if (exam) {
      updateMutation.mutate(
        {
          examId: exam.exam_id,
          payload,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );

      return;
    }

    createMutation.mutate(
      payload,
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  if (!open) {
    return null;
  }

  /* ======================================================================== */
  /* Render                                                                   */
  /* ======================================================================== */

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={isPending}
          className="absolute inset-0 bg-slate-950/35 backdrop-blur-[3px]"
        />

        <section className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-border/50 bg-card shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
          {/* Header */}

          <header className="flex items-start justify-between border-b border-border/45 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 text-violet-600">
                <GraduationCap
                  size={20}
                />
              </span>

              <div>
                <h2 className="text-[16px] font-semibold">
                  {isEditing
                    ? "Edit Exam Schedule"
                    : "Create Exam Schedule"}
                </h2>

                <p className="mt-1 text-[11px] text-muted-foreground">
                  Select a grade, then
                  configure its exam
                  subjects.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition hover:bg-muted disabled:opacity-50"
            >
              <X size={15} />
            </button>
          </header>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {/* Validation */}

              {validationError && (
                <div className="mb-5 flex items-start gap-2.5 rounded-[16px] border border-rose-200/70 bg-rose-50/70 px-3.5 py-3 text-rose-700">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="text-[11px] leading-5">
                    {validationError}
                  </p>
                </div>
              )}

              {/* General information */}

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Exam title">
                  <input
                    value={title}
                    onChange={(event) => {
                      setTitle(
                        event.target.value,
                      );

                      setValidationError(
                        null,
                      );
                    }}
                    placeholder="e.g. First Semester Final Exam"
                    className="h-10 w-full rounded-[13px] border border-border/60 bg-background px-3 text-[12px] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                  />
                </Field>

                <Field label="Type">
                  <div className="grid grid-cols-2 gap-2">
                    <TypeButton
                      active={
                        type === "exam"
                      }
                      onClick={() => {
                        setType("exam");
                        setValidationError(
                          null,
                        );
                      }}
                      label="Exam"
                    />

                    <TypeButton
                      active={
                        type === "quiz"
                      }
                      onClick={() => {
                        setType("quiz");
                        setValidationError(
                          null,
                        );
                      }}
                      label="Quiz"
                    />
                  </div>
                </Field>

                <Field
                  label="Grade"
                  className="md:col-span-2"
                >
                  <div className="relative">
                    <select
                      value={
                        gradeLevelId ?? ""
                      }
                      onChange={(event) =>
                        handleGradeChange(
                          event.target
                            .value,
                        )
                      }
                      className="h-10 w-full appearance-none rounded-[13px] border border-border/60 bg-background px-3 pr-9 text-[12px] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                    >
                      <option value="">
                        Select grade
                      </option>

                      {grades.map(
                        (grade) => (
                          <option
                            key={grade.id}
                            value={
                              grade.id
                            }
                          >
                            {grade.name}
                          </option>
                        ),
                      )}
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </Field>
              </div>

              {/* Subjects */}

              {gradeLevelId !== null && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-[13px] font-semibold">
                        Exam Subjects
                      </h3>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        Choose the subjects
                        that will be
                        included in this
                        schedule.
                      </p>
                    </div>

                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-semibold text-violet-700">
                      {subjects.length}{" "}
                      selected
                    </span>
                  </div>

                  {setupQuery.isLoading ? (
                    <div className="rounded-[18px] border border-border/45 bg-muted/15 p-8 text-center">
                      <Loader2
                        size={20}
                        className="mx-auto animate-spin text-violet-600"
                      />

                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Loading
                        subjects...
                      </p>
                    </div>
                  ) : setupQuery.isError ? (
                    <div className="rounded-[18px] border border-rose-200/60 bg-rose-50/60 p-5 text-center">
                      <AlertCircle
                        size={20}
                        className="mx-auto text-rose-600"
                      />

                      <p className="mt-2 text-[11px] text-rose-700">
                        Could not load
                        subjects for
                        this grade.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          void setupQuery.refetch()
                        }
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1.5 text-[10px] font-medium text-white"
                      >
                        <RefreshCw
                          size={11}
                        />

                        Retry
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Subject selector */}

                      <div className="flex flex-wrap gap-2">
                        {setupSubjects.map(
                          (subject) => {
                            const selected =
                              selectedSubjectIds.has(
                                subject.grade_subject_id,
                              );

                            return (
                              <div
                                key={
                                  subject.grade_subject_id
                                }
                                className={`group inline-flex items-center overflow-hidden rounded-full border transition ${
                                  selected
                                    ? "border-violet-300 bg-violet-50 text-violet-700"
                                    : "border-border/60 bg-background text-foreground/70 hover:bg-muted/40"
                                }`}
                              >
                                {/* Main selection button */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    selected
                                      ? removeSubject(
                                          subject.grade_subject_id,
                                        )
                                      : addSubject(
                                          subject.grade_subject_id,
                                        )
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-medium"
                                >
                                  {selected ? (
                                    <Check
                                      size={
                                        11
                                      }
                                    />
                                  ) : (
                                    <Plus
                                      size={
                                        11
                                      }
                                    />
                                  )}

                                  {
                                    subject.subject_name
                                  }
                                </button>

                                {/* Dedicated delete button */}

                                {selected && (
                                  <button
                                    type="button"
                                    aria-label={`Remove ${subject.subject_name}`}
                                    onClick={() =>
                                      removeSubject(
                                        subject.grade_subject_id,
                                      )
                                    }
                                    className="flex h-full items-center border-l border-violet-200/70 px-2 text-violet-500 transition hover:bg-rose-50 hover:text-rose-600"
                                  >
                                    <Trash2
                                      size={
                                        11
                                      }
                                    />
                                  </button>
                                )}
                              </div>
                            );
                          },
                        )}
                      </div>

                      {/* Empty state */}

                      {subjects.length ===
                      0 ? (
                        <div className="mt-4 rounded-[18px] border border-dashed border-border/60 bg-muted/[0.12] p-8 text-center">
                          <GraduationCap
                            size={22}
                            className="mx-auto text-muted-foreground"
                          />

                          <p className="mt-2 text-[11px] text-muted-foreground">
                            Select at
                            least one
                            subject
                            above.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {subjects.map(
                            (
                              subject,
                            ) => {
                              const setupSubject =
                                setupSubjects.find(
                                  (
                                    item,
                                  ) =>
                                    item.grade_subject_id ===
                                    subject.grade_subject_id,
                                );

                              if (
                                !setupSubject
                              ) {
                                return null;
                              }

                              return (
                                <SubjectFormCard
                                  key={
                                    subject.grade_subject_id
                                  }
                                  subject={
                                    subject
                                  }
                                  setupSubject={
                                    setupSubject
                                  }
                                  onRemove={() =>
                                    removeSubject(
                                      subject.grade_subject_id as number,
                                    )
                                  }
                                  onUpdate={(
                                    patch,
                                  ) =>
                                    updateSubject(
                                      subject.grade_subject_id as number,
                                      patch,
                                    )
                                  }
                                  onToggleTeacher={(
                                    teacherId,
                                  ) =>
                                    toggleTeacher(
                                      subject.grade_subject_id as number,
                                      teacherId,
                                    )
                                  }
                                />
                              );
                            },
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}

            <footer className="flex items-center justify-end gap-2 border-t border-border/45 bg-muted/[0.08] p-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-full border border-border/60 bg-background px-4 py-2 text-[11px] font-medium text-foreground/70 transition hover:bg-muted/50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isPending ||
                  !title.trim() ||
                  gradeLevelId === null ||
                  subjects.length === 0
                }
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-[11px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending && (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                )}

                {isEditing
                  ? "Save Changes"
                  : "Create Schedule"}
              </button>
            </footer>
          </form>
        </section>
      </div>

      {/* ================================================================== */}
      {/* Delete Subject Confirmation Dialog                                 */}
      {/* ================================================================== */}

      <DeleteSubjectDialog
        open={
          deleteSubject !== null
        }
        subjectName={
          deleteSubject?.subjectName ??
          ""
        }
        loading={
          deleteSubjectMutation.isPending
        }
        onClose={
          closeDeleteSubjectDialog
        }
        onConfirm={
          confirmDeleteSubject
        }
      />
    </>
  );
}

/* ========================================================================== */
/* Subject Form Card                                                          */
/* ========================================================================== */

function SubjectFormCard({
  subject,
  setupSubject,
  onRemove,
  onUpdate,
  onToggleTeacher,
}: {
  subject: ExamFormSubject;

  setupSubject: {
    grade_subject_id: number;
    subject_name: string;

    auto_teachers: {
      teacher_id: number;
      teacher_name: string;
    }[];
  };

  onRemove: () => void;

  onUpdate: (
    patch: Partial<ExamFormSubject>,
  ) => void;

  onToggleTeacher: (
    teacherId: number,
  ) => void;
}) {
  const [dateOpen, setDateOpen] =
    useState(false);

  const [
    startTimeOpen,
    setStartTimeOpen,
  ] = useState(false);

  const [
    endTimeOpen,
    setEndTimeOpen,
  ] = useState(false);

  const selectedDate =
    parseDateValue(
      subject.exam_date,
    );

  const selectedStartTime =
    parseTimeValue(
      subject.start_time,
    );

  const today =
    startOfDay(new Date());

  return (
    <section className="rounded-[20px] border border-border/45 bg-card p-4 transition hover:border-violet-200/70 hover:shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
      {/* Subject header */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-emerald-50 text-emerald-600">
            <GraduationCap
              size={16}
            />
          </span>

          <div>
            <h4 className="text-[12px] font-semibold">
              {
                setupSubject.subject_name
              }
            </h4>

            <p className="mt-0.5 text-[9px] text-muted-foreground">
              Configure date,
              time and
              teachers
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${setupSubject.subject_name}`}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Date + Time */}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {/* Date */}

        <Field label="Exam date">
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setDateOpen(
                  (value) =>
                    !value,
                )
              }
              className={`flex h-9 w-full items-center gap-2 rounded-[12px] border bg-background px-3 text-left text-[11px] outline-none transition ${
                dateOpen
                  ? "border-violet-400 ring-2 ring-violet-500/10"
                  : "border-border/60 hover:border-border"
              }`}
            >
              <CalendarDays
                size={13}
                className="shrink-0 text-violet-500"
              />

              <span
                className={
                  selectedDate
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              >
                {selectedDate
                  ? format(
                      selectedDate,
                      "dd MMM yyyy",
                    )
                  : "Select date"}
              </span>

              <ChevronDown
                size={12}
                className="ml-auto text-muted-foreground"
              />
            </button>

            {dateOpen && (
              <div className="absolute left-0 top-[calc(100%+6px)] z-40 rounded-[18px] border border-border/60 bg-card p-2 shadow-[0_18px_45px_rgba(15,23,42,0.15)]">
                <Calendar
                  mode="single"
                  selected={
                    selectedDate
                  }
                  onSelect={(
                    date,
                  ) => {
                    if (!date)
                      return;

                    if (
                      isBefore(
                        startOfDay(
                          date,
                        ),
                        today,
                      )
                    ) {
                      return;
                    }

                    onUpdate({
                      exam_date:
                        format(
                          date,
                          "yyyy-MM-dd",
                        ),
                    });

                    setDateOpen(
                      false,
                    );
                  }}
                  disabled={{
                    before:
                      today,
                  }}
                  defaultMonth={
                    selectedDate ??
                    today
                  }
                  startMonth={today}
                  captionLayout="label"
                />
              </div>
            )}
          </div>
        </Field>

        {/* Start time */}

        <Field label="Start time">
          <TimePicker
            value={
              subject.start_time
            }
            open={
              startTimeOpen
            }
            onOpenChange={
              setStartTimeOpen
            }
            onChange={(
              value,
            ) => {
              onUpdate({
                start_time:
                  value,
              });

              setStartTimeOpen(
                false,
              );
            }}
          />
        </Field>

        {/* End time */}

        <Field label="End time">
          <TimePicker
            value={
              subject.end_time
            }
            open={
              endTimeOpen
            }
            onOpenChange={
              setEndTimeOpen
            }
            minTime={
              selectedStartTime
                ? format(
                    selectedStartTime,
                    "HH:mm",
                  )
                : undefined
            }
            onChange={(
              value,
            ) => {
              if (
                subject.start_time &&
                !isValidTimeRange(
                  subject.start_time,
                  value,
                )
              ) {
                return;
              }

              onUpdate({
                end_time:
                  value,
              });

              setEndTimeOpen(
                false,
              );
            }}
          />
        </Field>
      </div>

      {/* Syllabus */}

      <div className="mt-3">
        <Field label="Syllabus">
          <textarea
            value={
              subject.syllabus
            }
            onChange={(
              event,
            ) =>
              onUpdate({
                syllabus:
                  event.target
                    .value,
              })
            }
            rows={2}
            placeholder="Optional syllabus or covered topics..."
            className="w-full resize-none rounded-[12px] border border-border/60 bg-background px-3 py-2 text-[11px] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
          />
        </Field>
      </div>

      {/* Teachers */}

      <div className="mt-3">
        <div className="mb-2 flex items-center gap-1.5">
          <Users
            size={12}
            className="text-violet-600"
          />

          <span className="text-[10px] font-semibold">
            Teachers
          </span>

          <span className="text-[9px] text-muted-foreground">
            (
            {
              subject
                .teacher_ids
                .length
            }{" "}
            selected)
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {setupSubject
            .auto_teachers
            .length === 0 ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1.5 text-[9px] text-amber-700">
              No teachers assigned
              automatically.
            </span>
          ) : (
            setupSubject.auto_teachers.map(
              (teacher) => {
                const selected =
                  subject.teacher_ids.includes(
                    teacher.teacher_id,
                  );

                return (
                  <button
                    key={
                      teacher.teacher_id
                    }
                    type="button"
                    onClick={() =>
                      onToggleTeacher(
                        teacher.teacher_id,
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-medium transition ${
                      selected
                        ? "border-violet-300 bg-violet-50 text-violet-700"
                        : "border-border/60 bg-background text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    {selected && (
                      <Check
                        size={10}
                      />
                    )}

                    {
                      teacher.teacher_name
                    }
                  </button>
                );
              },
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* Time Picker                                                                */
/* ========================================================================== */

function TimePicker({
  value,
  onChange,
  open,
  onOpenChange,
  minTime,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  minTime?: string;
}) {
  const current =
    parseTimeValue(value);

  const currentHour =
    current?.getHours() ?? 8;

  const currentMinute =
    current?.getMinutes() ?? 0;

  const hours = Array.from(
    {
      length: 24,
    },
    (_, index) => index,
  );

  const minutes = [
    0,
    15,
    30,
    45,
  ];

  function isDisabled(
    hour: number,
    minute: number,
  ) {
    if (!minTime) {
      return false;
    }

    const minimum =
      parseTimeValue(minTime);

    if (!minimum) {
      return false;
    }

    const candidate =
      hour * 60 + minute;

    const minimumMinutes =
      minimum.getHours() * 60 +
      minimum.getMinutes();

    return (
      candidate <=
      minimumMinutes
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          onOpenChange(!open)
        }
        className={`flex h-9 w-full items-center gap-2 rounded-[12px] border bg-background px-3 text-left text-[11px] outline-none transition ${
          open
            ? "border-violet-400 ring-2 ring-violet-500/10"
            : "border-border/60 hover:border-border"
        }`}
      >
        <Clock3
          size={13}
          className="shrink-0 text-violet-500"
        />

        <span
          className={
            value
              ? "text-foreground"
              : "text-muted-foreground"
          }
        >
          {current
            ? format(
                current,
                "hh:mm a",
              )
            : "Select time"}
        </span>

        <ChevronDown
          size={12}
          className="ml-auto text-muted-foreground"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[250px] rounded-[18px] border border-border/60 bg-card p-3 shadow-[0_18px_45px_rgba(15,23,42,0.15)]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold">
              Select time
            </span>

            {minTime && (
              <span className="text-[9px] text-muted-foreground">
                After {minTime}
              </span>
            )}
          </div>

          <div className="grid max-h-[230px] grid-cols-4 gap-1.5 overflow-y-auto">
            {hours.flatMap(
              (hour) =>
                minutes.map(
                  (minute) => {
                    const disabled =
                      isDisabled(
                        hour,
                        minute,
                      );

                    const active =
                      hour ===
                        currentHour &&
                      minute ===
                        currentMinute;

                    const date =
                      new Date();

                    date.setHours(
                      hour,
                      minute,
                      0,
                      0,
                    );

                    const formatted =
                      format(
                        date,
                        "HH:mm",
                      );

                    return (
                      <button
                        key={
                          formatted
                        }
                        type="button"
                        disabled={
                          disabled
                        }
                        onClick={() =>
                          onChange(
                            formatted,
                          )
                        }
                        className={`rounded-[9px] px-2 py-1.5 text-[9px] font-medium transition ${
                          active
                            ? "bg-violet-600 text-white"
                            : disabled
                              ? "cursor-not-allowed bg-muted/20 text-muted-foreground/30"
                              : "bg-muted/35 text-foreground/70 hover:bg-violet-50 hover:text-violet-700"
                        }`}
                      >
                        {format(
                          date,
                          "hh:mm a",
                        )}
                      </button>
                    );
                  },
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Delete Subject Dialog                                                      */
/* ========================================================================== */

function DeleteSubjectDialog({
  open,
  subjectName,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  subjectName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}

      <button
        type="button"
        aria-label="Close delete subject dialog"
        onClick={onClose}
        disabled={loading}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[4px]"
      />

      {/* Dialog */}

      <section className="relative z-10 w-full max-w-[380px] overflow-hidden rounded-[26px] border border-rose-200/50 bg-card shadow-[0_25px_80px_rgba(15,23,42,0.2)]">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-rose-50 text-rose-600">
              <Trash2
                size={19}
              />
            </span>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition hover:bg-muted disabled:opacity-50"
            >
              <X size={15} />
            </button>
          </div>

          <h2 className="mt-4 text-[15px] font-semibold">
            Remove subject?
          </h2>

          <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
            Are you sure you want to
            remove{" "}
            <span className="font-semibold text-foreground">
              {subjectName}
            </span>{" "}
            from this exam
            schedule?
          </p>

          <div className="mt-4 rounded-[15px] border border-rose-100 bg-rose-50/60 px-3.5 py-3">
            <div className="flex items-start gap-2 text-[10px] leading-5 text-rose-700">
              <AlertCircle
                size={13}
                className="mt-0.5 shrink-0"
              />

              <span>
                This subject and its
                scheduled exam details
                will be removed from
                the saved schedule.
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border/45 bg-muted/[0.08] p-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-border/60 bg-background px-4 py-2 text-[11px] font-medium text-foreground/70 transition hover:bg-muted/50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-[11px] font-medium text-white shadow-[0_6px_18px_rgba(225,29,72,0.16)] transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <Loader2
                size={12}
                className="animate-spin"
              />
            )}

            {loading
              ? "Removing..."
              : "Remove Subject"}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ========================================================================== */
/* Shared Components                                                          */
/* ========================================================================== */

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`block ${className}`}
    >
      <span className="mb-1.5 block text-[10px] font-medium text-foreground/70">
        {label}
      </span>

      {children}
    </label>
  );
}

function TypeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-[13px] border text-[11px] font-medium transition ${
        active
          ? "border-violet-300 bg-violet-50 text-violet-700"
          : "border-border/60 bg-background text-muted-foreground hover:bg-muted/40"
      }`}
    >
      {label}
    </button>
  );
}