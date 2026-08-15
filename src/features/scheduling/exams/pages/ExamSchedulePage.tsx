import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  GraduationCap,
  Plus,
  RefreshCw,
  School,
  Users,
} from "lucide-react";

import { useAcademicSettings } from "@/features/settings/academic/hooks/useAcademicSettings";
import { useGrades } from "@/features/academics/grades/hooks/useGrades";

import {
  useAdminExams,
  useDeleteExamSchedule,
} from "../hooks/useExamSchedule";

import type {
  AdminExam,
  ExamSubject,
} from "../types/exam-schedule.types";

import { ExamFormDialog } from "../components/ExamFormDialog";

export function ExamSchedulePage() {
  const academicSettingsQuery = useAcademicSettings();
  const gradesQuery = useGrades();

  const settings = academicSettingsQuery.data;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExam, setEditingExam] =
    useState<AdminExam | null>(null);

  const currentAcademicYear = settings?.academicYears.find(
    (year) =>
      year.id ===
      settings.settings.currentAcademicYearId,
  );

  const currentTerm = settings?.academicTerms.find(
    (term) =>
      term.id ===
      settings.settings.currentSemesterId,
  );

  const academicYearId = currentAcademicYear
    ? Number(currentAcademicYear.id)
    : null;

  const semesterId = currentTerm
    ? Number(currentTerm.id)
    : null;

  const examsQuery = useAdminExams(
    academicYearId,
    semesterId,
  );

  const deleteMutation =
    useDeleteExamSchedule();

  const isInitialLoading =
    academicSettingsQuery.isLoading ||
    gradesQuery.isLoading ||
    examsQuery.isLoading;

  function openCreate() {
    setEditingExam(null);
    setDialogOpen(true);
  }

  function openEdit(exam: AdminExam) {
    setEditingExam(exam);
    setDialogOpen(true);
  }

  function handleDelete(exam: AdminExam) {
    if (
      !window.confirm(
        `Delete "${exam.title}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    deleteMutation.mutate(exam.exam_id);
  }

  if (isInitialLoading) {
    return <ExamScheduleSkeleton />;
  }

  if (academicSettingsQuery.isError) {
    return (
      <ErrorState
        title="Academic settings could not be loaded."
        message={
          academicSettingsQuery.error?.message
        }
        onRetry={() =>
          void academicSettingsQuery.refetch()
        }
      />
    );
  }

  if (!settings) {
    return (
      <ErrorState
        title="Academic settings are unavailable."
        message="The current academic year and semester could not be resolved."
        onRetry={() =>
          void academicSettingsQuery.refetch()
        }
      />
    );
  }

  if (
    !currentAcademicYear ||
    !currentTerm ||
    academicYearId === null ||
    semesterId === null
  ) {
    return (
      <section className="rounded-[26px] border border-amber-200/70 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center shadow-[0_10px_35px_rgba(245,158,11,0.06)]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-amber-100 text-amber-600">
          <AlertCircle size={23} />
        </span>

        <h2 className="mt-4 text-[15px] font-semibold">
          No active academic period
        </h2>

        <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
          Set the current academic year and semester
          from Academic Settings before managing exams.
        </p>
      </section>
    );
  }

  if (examsQuery.isError) {
    return (
      <div className="space-y-5">
        <PageHeader
          academicYear={currentAcademicYear.name}
          semester={currentTerm.semesterName}
          onCreate={openCreate}
          isCreating={false}
        />

        <ErrorState
          title="Exam schedules could not be loaded."
          message={examsQuery.error?.message}
          onRetry={() =>
            void examsQuery.refetch()
          }
        />
      </div>
    );
  }

  const exams = examsQuery.data ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        academicYear={currentAcademicYear.name}
        semester={currentTerm.semesterName}
        onCreate={openCreate}
        isCreating={false}
      />

      <ExamSummary exams={exams} />

      {exams.length === 0 ? (
        <EmptyExamState
          onCreate={openCreate}
        />
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <ExamCard
              key={exam.exam_id}
              exam={exam}
              onEdit={() => openEdit(exam)}
              onDelete={() =>
                handleDelete(exam)
              }
              isDeleting={
                deleteMutation.isPending &&
                deleteMutation.variables ===
                  exam.exam_id
              }
            />
          ))}
        </div>
      )}

      <ExamFormDialog
        open={dialogOpen}
        exam={editingExam}
        grades={gradesQuery.data ?? []}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function PageHeader({
  academicYear,
  semester,
  onCreate,
  isCreating,
}: {
  academicYear: string;
  semester: string;
  onCreate: () => void;
  isCreating: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-border/45 bg-card shadow-[0_12px_40px_rgba(30,20,70,0.045)]">
      <div className="relative p-4 sm:p-5">
        <div className="absolute -right-16 -top-20 h-40 w-40 rounded-full bg-violet-400/[0.08] blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-36 w-36 rounded-full bg-cyan-400/[0.06] blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 text-violet-600">
              <ClipboardList size={20} />
            </span>

            <div className="min-w-0">
              <h1 className="text-[17px] font-semibold tracking-[-0.02em]">
                Exam Schedules
              </h1>

              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <CalendarDays size={12} />
                {academicYear}
                <span>·</span>
                {semester}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreate}
            disabled={isCreating}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-[12px] font-medium text-white shadow-[0_7px_18px_rgba(124,58,237,0.18)] transition hover:from-violet-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} />
            Create Exam
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary                                                                    */
/* -------------------------------------------------------------------------- */

function ExamSummary({
  exams,
}: {
  exams: AdminExam[];
}) {
  const stats = useMemo(() => {
    const subjects = exams.reduce(
      (total, exam) =>
        total + exam.subjects.length,
      0,
    );

    const examsCount = exams.filter(
      (exam) => exam.type === "exam",
    ).length;

    const quizzesCount = exams.filter(
      (exam) => exam.type === "quiz",
    ).length;

    return {
      exams: examsCount,
      quizzes: quizzesCount,
      subjects,
    };
  }, [exams]);

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <SummaryCard
        label="Exam Sessions"
        value={stats.exams}
        icon={ClipboardList}
        className="border-violet-200/70 bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-700"
      />

      <SummaryCard
        label="Quizzes"
        value={stats.quizzes}
        icon={CheckCircle2}
        className="border-cyan-200/70 bg-gradient-to-br from-cyan-50 to-sky-50 text-cyan-700"
      />

      <SummaryCard
        label="Scheduled Subjects"
        value={stats.subjects}
        icon={GraduationCap}
        className="border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700"
      />
    </section>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: typeof ClipboardList;
  className: string;
}) {
  return (
    <article
      className={`rounded-[22px] border p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium opacity-75">
          {label}
        </p>

        <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/60">
          <Icon size={15} />
        </span>
      </div>

      <p className="mt-2 text-[23px] font-semibold tracking-[-0.03em]">
        {value}
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Exam Card                                                                  */
/* -------------------------------------------------------------------------- */

function ExamCard({
  exam,
  onEdit,
  onDelete,
  isDeleting,
}: {
  exam: AdminExam;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const isQuiz = exam.type === "quiz";

  return (
    <section className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_8px_30px_rgba(30,20,70,0.035)] transition hover:shadow-[0_12px_35px_rgba(30,20,70,0.06)]">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${
              isQuiz
                ? "bg-cyan-100 text-cyan-600"
                : "bg-violet-100 text-violet-600"
            }`}
          >
            {isQuiz ? (
              <CheckCircle2 size={19} />
            ) : (
              <ClipboardList size={19} />
            )}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-[14px] font-semibold">
                {exam.title}
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                  isQuiz
                    ? "bg-cyan-50 text-cyan-700"
                    : "bg-violet-50 text-violet-700"
                }`}
              >
                {isQuiz ? "Quiz" : "Exam"}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <GraduationCap size={12} />
                {exam.grade_level.name}
              </span>

              <span className="inline-flex items-center gap-1">
                <School size={12} />
                {exam.subjects.length}{" "}
                {exam.subjects.length === 1
                  ? "subject"
                  : "subjects"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full border border-border/60 bg-background px-3.5 py-2 text-[11px] font-medium text-foreground/75 transition hover:bg-muted/50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50 px-3.5 py-2 text-[11px] font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
          >
            {isDeleting && (
              <RefreshCw
                size={12}
                className="animate-spin"
              />
            )}
            Delete
          </button>
        </div>
      </div>

      <div className="border-t border-border/40 bg-muted/[0.07] p-3 sm:p-4">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {exam.subjects.map((subject) => (
            <ExamSubjectCard
              key={subject.exam_subject_id}
              subject={subject}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Subject Card                                                               */
/* -------------------------------------------------------------------------- */

function ExamSubjectCard({
  subject,
}: {
  subject: ExamSubject;
}) {
  return (
    <article className="rounded-[18px] border border-border/40 bg-card p-3.5">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-600">
          <GraduationCap size={15} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[12px] font-semibold">
            {subject.subject_name}
          </h3>

          <div className="mt-2 space-y-1.5 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={11} />
              {formatDate(subject.exam_date)}
            </div>

            <div className="flex items-center gap-1.5">
              <Clock3 size={11} />
              {formatTime(subject.start_time)}
              <span>–</span>
              {formatTime(subject.end_time)}
            </div>

            <div className="flex items-center gap-1.5">
              <Users size={11} />
              {subject.teachers.length}{" "}
              {subject.teachers.length === 1
                ? "teacher"
                : "teachers"}
            </div>
          </div>
        </div>
      </div>

      {subject.teachers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {subject.teachers.map((teacher) => (
            <span
              key={`${subject.exam_subject_id}-${teacher.teacher_id}`}
              className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-medium text-violet-700"
            >
              {teacher.teacher_name}
            </span>
          ))}
        </div>
      )}

      {subject.syllabus && (
        <div className="mt-3 rounded-[12px] bg-muted/35 px-2.5 py-2 text-[10px] leading-4 text-muted-foreground">
          <span className="font-medium text-foreground/70">
            Syllabus:
          </span>{" "}
          {subject.syllabus}
        </div>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty                                                                      */
/* -------------------------------------------------------------------------- */

function EmptyExamState({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <section className="rounded-[26px] border border-dashed border-border/60 bg-card p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600">
        <ClipboardList size={21} />
      </span>

      <h2 className="mt-4 text-[15px] font-semibold">
        No exam schedules
      </h2>

      <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
        There are no exams or quizzes scheduled for
        the current academic period.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-[12px] font-medium text-white"
      >
        <Plus size={14} />
        Create Exam
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <section className="rounded-[26px] border border-rose-200/60 bg-gradient-to-br from-rose-50/70 to-orange-50/50 p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-rose-100 text-rose-600">
        <AlertCircle size={23} />
      </span>

      <h2 className="mt-3 text-sm font-semibold">
        {title}
      </h2>

      {message && (
        <p className="mx-auto mt-1.5 max-w-md text-[12px] text-muted-foreground">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-[12px] font-medium text-white"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function ExamScheduleSkeleton() {
  return (
    <div className="space-y-5">
      <section className="rounded-[26px] border border-border/45 bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 animate-pulse rounded-[15px] bg-muted/50" />

          <div className="space-y-2">
            <div className="h-4 w-36 animate-pulse rounded-md bg-muted/50" />
            <div className="h-3 w-48 animate-pulse rounded-md bg-muted/40" />
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-[22px] bg-muted/40"
            />
          ),
        )}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-[24px] bg-muted/35"
            />
          ),
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatTime(value: string) {
  if (!value) return "—";

  const parts = value.split(":");

  if (parts.length < 2) {
    return value;
  }

  return `${parts[0]}:${parts[1]}`;
}