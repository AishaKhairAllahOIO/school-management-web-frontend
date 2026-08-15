import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  GraduationCap,
  Loader2,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { useExamSetup } from "../hooks/useExamSchedule";
import {
  useCreateExamSchedule,
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

  const [title, setTitle] = useState("");
  const [type, setType] =
    useState<"exam" | "quiz">("exam");

  const [gradeLevelId, setGradeLevelId] =
    useState<number | null>(null);

  const [subjects, setSubjects] = useState<
    ExamFormSubject[]
  >([]);

  const setupQuery =
    useExamSetup(gradeLevelId);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  useEffect(() => {
    if (!open) return;

    if (exam) {
      setTitle(exam.title);
      setType(exam.type);
      setGradeLevelId(exam.grade_level.id);

      setSubjects(
        exam.subjects.map((subject) => ({
          grade_subject_id:
            subject.grade_subject_id,
          exam_date: subject.exam_date,
          start_time: subject.start_time,
          end_time: subject.end_time,
          syllabus: subject.syllabus ?? "",
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

  function handleGradeChange(
    value: string,
  ) {
    const id = value
      ? Number(value)
      : null;

    setGradeLevelId(id);
    setSubjects([]);
  }

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
  }

  function removeSubject(
    gradeSubjectId: number,
  ) {
    setSubjects((current) =>
      current.filter(
        (subject) =>
          subject.grade_subject_id !==
          gradeSubjectId,
      ),
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
          ? { ...subject, ...patch }
          : subject,
      ),
    );
  }

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

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (
      gradeLevelId === null ||
      !title.trim() ||
      subjects.length === 0
    ) {
      return;
    }

    const payload: ExamFormData = {
      title: title.trim(),
      type,
      grade_level_id: gradeLevelId,
      subjects,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-[3px]"
      />

      <section className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-border/50 bg-card shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
        <header className="flex items-start justify-between border-b border-border/45 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 text-violet-600">
              <GraduationCap size={20} />
            </span>

            <div>
              <h2 className="text-[16px] font-semibold">
                {isEditing
                  ? "Edit Exam Schedule"
                  : "Create Exam Schedule"}
              </h2>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Select a grade, then configure its
                exam subjects.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition hover:bg-muted"
          >
            <X size={15} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Exam title">
                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. First Semester Final Exam"
                  className="h-10 w-full rounded-[13px] border border-border/60 bg-background px-3 text-[12px] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                />
              </Field>

              <Field label="Type">
                <div className="grid grid-cols-2 gap-2">
                  <TypeButton
                    active={type === "exam"}
                    onClick={() =>
                      setType("exam")
                    }
                    label="Exam"
                  />

                  <TypeButton
                    active={type === "quiz"}
                    onClick={() =>
                      setType("quiz")
                    }
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
                        event.target.value,
                      )
                    }
                    className="h-10 w-full appearance-none rounded-[13px] border border-border/60 bg-background px-3 pr-9 text-[12px] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
                  >
                    <option value="">
                      Select grade
                    </option>

                    {grades.map((grade) => (
                      <option
                        key={grade.id}
                        value={grade.id}
                      >
                        {grade.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </Field>
            </div>

            {gradeLevelId !== null && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-[13px] font-semibold">
                      Exam Subjects
                    </h3>

                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Choose the subjects that will
                      be included in this schedule.
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-semibold text-violet-700">
                    {subjects.length} selected
                  </span>
                </div>

                {setupQuery.isLoading ? (
                  <div className="rounded-[18px] border border-border/45 bg-muted/15 p-8 text-center">
                    <Loader2
                      size={20}
                      className="mx-auto animate-spin text-violet-600"
                    />

                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Loading subjects...
                    </p>
                  </div>
                ) : setupQuery.isError ? (
                  <div className="rounded-[18px] border border-rose-200/60 bg-rose-50/60 p-5 text-center">
                    <AlertCircle
                      size={20}
                      className="mx-auto text-rose-600"
                    />

                    <p className="mt-2 text-[11px] text-rose-700">
                      Could not load subjects for
                      this grade.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        void setupQuery.refetch()
                      }
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1.5 text-[10px] font-medium text-white"
                    >
                      <RefreshCw size={11} />
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {setupSubjects.map(
                        (subject) => {
                          const selected =
                            selectedSubjectIds.has(
                              subject.grade_subject_id,
                            );

                          return (
                            <button
                              key={
                                subject.grade_subject_id
                              }
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
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-medium transition ${
                                selected
                                  ? "border-violet-300 bg-violet-50 text-violet-700"
                                  : "border-border/60 bg-background text-foreground/70 hover:bg-muted/40"
                              }`}
                            >
                              {selected && (
                                <Check size={11} />
                              )}

                              {!selected && (
                                <Plus size={11} />
                              )}

                              {
                                subject.subject_name
                              }
                            </button>
                          );
                        },
                      )}
                    </div>

                    {subjects.length === 0 ? (
                      <div className="mt-4 rounded-[18px] border border-dashed border-border/60 bg-muted/[0.12] p-8 text-center">
                        <GraduationCap
                          size={22}
                          className="mx-auto text-muted-foreground"
                        />

                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Select at least one subject
                          above.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {subjects.map(
                          (subject) => {
                            const setupSubject =
                              setupSubjects.find(
                                (item) =>
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

          <footer className="flex items-center justify-end gap-2 border-t border-border/45 bg-muted/[0.08] p-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-full border border-border/60 bg-background px-4 py-2 text-[11px] font-medium text-foreground/70"
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-[11px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}

/* -------------------------------------------------------------------------- */
/* Subject Form                                                               */
/* -------------------------------------------------------------------------- */

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
  return (
    <section className="rounded-[20px] border border-border/45 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-emerald-50 text-emerald-600">
            <GraduationCap size={16} />
          </span>

          <div>
            <h4 className="text-[12px] font-semibold">
              {setupSubject.subject_name}
            </h4>

            <p className="mt-0.5 text-[9px] text-muted-foreground">
              Configure date, time and teachers
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Field label="Exam date">
          <div className="relative">
            <CalendarDays
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="date"
              value={subject.exam_date}
              onChange={(event) =>
                onUpdate({
                  exam_date:
                    event.target.value,
                })
              }
              className="h-9 w-full rounded-[12px] border border-border/60 bg-background pl-9 pr-2 text-[11px] outline-none focus:border-violet-400"
            />
          </div>
        </Field>

        <Field label="Start time">
          <div className="relative">
            <Clock3
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="time"
              value={subject.start_time}
              onChange={(event) =>
                onUpdate({
                  start_time:
                    event.target.value,
                })
              }
              className="h-9 w-full rounded-[12px] border border-border/60 bg-background pl-9 pr-2 text-[11px] outline-none focus:border-violet-400"
            />
          </div>
        </Field>

        <Field label="End time">
          <div className="relative">
            <Clock3
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="time"
              value={subject.end_time}
              onChange={(event) =>
                onUpdate({
                  end_time:
                    event.target.value,
                })
              }
              className="h-9 w-full rounded-[12px] border border-border/60 bg-background pl-9 pr-2 text-[11px] outline-none focus:border-violet-400"
            />
          </div>
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Syllabus">
          <textarea
            value={subject.syllabus}
            onChange={(event) =>
              onUpdate({
                syllabus:
                  event.target.value,
              })
            }
            rows={2}
            placeholder="Optional syllabus or covered topics..."
            className="w-full resize-none rounded-[12px] border border-border/60 bg-background px-3 py-2 text-[11px] outline-none focus:border-violet-400"
          />
        </Field>
      </div>

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
            ({subject.teacher_ids.length} selected)
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {setupSubject.auto_teachers.length ===
          0 ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1.5 text-[9px] text-amber-700">
              No teachers assigned automatically.
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
                        : "border-border/60 bg-background text-muted-foreground"
                    }`}
                  >
                    {selected && (
                      <Check size={10} />
                    )}

                    {teacher.teacher_name}
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

/* -------------------------------------------------------------------------- */
/* Shared Components                                                          */
/* -------------------------------------------------------------------------- */

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
    <label className={`block ${className}`}>
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