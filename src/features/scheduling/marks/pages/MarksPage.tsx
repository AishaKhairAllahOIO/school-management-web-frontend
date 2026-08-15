import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  RefreshCw,
  Users,
} from "lucide-react";

import { useAcademicSettings } from "@/features/settings/academic/hooks/useAcademicSettings";

import { useAllMarks } from "../hooks/useMarks";

import type {
  MarkColumn,
  MarkStudent,
  MarkSubject,
} from "../types/marks.types";

export function MarksPage() {
  const academicSettingsQuery = useAcademicSettings();

  const settings = academicSettingsQuery.data;

  const currentAcademicYear = settings?.academicYears.find(
    (year) => year.id === settings.settings.currentAcademicYearId,
  );

  const currentTerm = settings?.academicTerms.find(
    (term) => term.id === settings.settings.currentSemesterId,
  );

  const academicYearId = currentAcademicYear
    ? Number(currentAcademicYear.id)
    : null;

  const semesterId = currentTerm ? Number(currentTerm.id) : null;

  const marksQuery = useAllMarks(academicYearId, semesterId);

  const marks = marksQuery.data;

  const isInitialLoading =
    academicSettingsQuery.isLoading || marksQuery.isLoading;

  if (isInitialLoading) {
    return <MarksPageSkeleton />;
  }

  if (academicSettingsQuery.isError) {
    return (
      <ErrorState
        title="Academic settings could not be loaded."
        message={academicSettingsQuery.error?.message}
        onRetry={() => void academicSettingsQuery.refetch()}
      />
    );
  }

  if (!settings) {
    return (
      <ErrorState
        title="Academic settings are unavailable."
        message="The current academic year and semester could not be resolved."
        onRetry={() => void academicSettingsQuery.refetch()}
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
      <section className="rounded-[26px] border border-amber-200/60 bg-amber-50/60 p-8 text-center">
        <AlertCircle className="mx-auto text-amber-600" size={24} />

        <h2 className="mt-3 text-sm font-semibold text-foreground">
          No active academic period
        </h2>

        <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
          Set the current academic year and current semester from Academic
          Settings before viewing student marks.
        </p>
      </section>
    );
  }

  if (marksQuery.isError && !marks) {
    return (
      <div className="space-y-5">
        <PageHeader
          academicYear={currentAcademicYear.name}
          semester={currentTerm.semesterName}
        />

        <ErrorState
          title="Marks could not be loaded."
          message={marksQuery.error?.message}
          onRetry={() => void marksQuery.refetch()}
        />
      </div>
    );
  }

  if (!marks) {
    return null;
  }

  const totalGrades = marks.grades.length;

  const totalClasses = marks.grades.reduce(
    (total, grade) => total + grade.classes.length,
    0,
  );

  const totalSubjects = marks.grades.reduce(
    (total, grade) =>
      total +
      grade.classes.reduce(
        (classTotal, classItem) => classTotal + classItem.subjects.length,
        0,
      ),
    0,
  );

  const totalStudents = marks.grades.reduce(
    (total, grade) =>
      total +
      grade.classes.reduce((classTotal, classItem) => {
        const students = classItem.subjects[0]?.students.length ?? 0;

        return classTotal + students;
      }, 0),
    0,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        academicYear={currentAcademicYear.name}
        semester={currentTerm.semesterName}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Grades"
          value={totalGrades}
          icon={GraduationCap}
          className="border-violet-200/60 bg-violet-50/65 text-violet-700"
        />

        <MetricCard
          label="Classes"
          value={totalClasses}
          icon={Users}
          className="border-sky-200/60 bg-sky-50/65 text-sky-700"
        />

        <MetricCard
          label="Subjects"
          value={totalSubjects}
          icon={BookOpen}
          className="border-emerald-200/60 bg-emerald-50/65 text-emerald-700"
        />

        <MetricCard
          label="Students"
          value={totalStudents}
          icon={Award}
          className="border-amber-200/60 bg-amber-50/65 text-amber-700"
        />
      </section>

      {marks.grades.length === 0 ? (
        <EmptyMarksState onRetry={() => void marksQuery.refetch()} />
      ) : (
        <div className="space-y-5">
          {marks.grades.map((grade) => (
            <section
              key={grade.id}
              className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5"
            >
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary">
                  <GraduationCap size={20} />
                </span>

                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.02em]">
                    {grade.name}
                  </h2>

                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Student marks and assessment results
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {grade.classes.map((classItem) => (
                  <section
                    key={classItem.class_room.id}
                    className="rounded-[22px] border border-border/45 bg-background/60 p-4"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-primary/[0.08] text-primary">
                        <Users size={16} />
                      </span>

                      <div>
                        <h3 className="text-[14px] font-semibold">
                          {classItem.class_room.name}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {classItem.subjects.length} subjects
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {classItem.subjects.map((subject) => (
                        <MarksSubjectTable
                          key={subject.subject_info.grade_subject_id}
                          subject={subject}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function PageHeader({
  academicYear,
  semester,
}: {
  academicYear: string;
  semester: string;
}) {
  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/[0.09] text-primary">
            <Award size={20} />
          </span>

          <div>
            <h1 className="text-[17px] font-semibold tracking-[-0.02em]">
              Student Marks
            </h1>

            <p className="mt-1 text-[12px] text-muted-foreground">
              {academicYear} · {semester}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  icon: typeof Award;
  className: string;
}) {
  return (
    <article className={`rounded-[22px] border p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium opacity-75">{label}</p>

        <Icon size={17} />
      </div>

      <p className="mt-2 text-[23px] font-semibold tracking-[-0.03em]">
        {value}
      </p>
    </article>
  );
}

function MarksSubjectTable({ subject }: { subject: MarkSubject }) {
  const columns = subject.columns;

  const students = subject.students;

  return (
    <section className="overflow-hidden rounded-[20px] border border-border/50 bg-card">
      <div className="flex flex-col gap-2 border-b border-border/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-[13px] font-semibold">
            {subject.subject_info.subject_name}
          </h4>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {students.length} students · {columns.length} assessments
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
          <CheckCircle2 size={12} />
          Marks
        </span>
      </div>

      {columns.length === 0 ? (
        <div className="p-6 text-center text-[12px] text-muted-foreground">
          No assessment components available.
        </div>
      ) : students.length === 0 ? (
        <div className="p-6 text-center text-[12px] text-muted-foreground">
          No students found in this class.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/45 bg-muted/25">
                <th className="sticky left-0 z-10 min-w-[220px] bg-muted/25 px-4 py-3 text-[11px] font-semibold text-foreground/70">
                  Student
                </th>

                {columns.map((column) => (
                  <th
                    key={column.id}
                    className="min-w-[120px] px-3 py-3 text-center text-[11px] font-semibold text-foreground/70"
                  >
                    <div>{column.name}</div>

                    <div className="mt-0.5 text-[10px] font-normal text-muted-foreground">
                      Max {formatNumber(column.max_mark)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <MarksStudentRow
                  key={student.enrollment_id}
                  student={student}
                  columns={columns}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function MarksStudentRow({
  student,
  columns,
  index,
}: {
  student: MarkStudent;
  columns: MarkColumn[];
  index: number;
}) {
  return (
    <tr
      className={`border-b border-border/35 last:border-b-0 ${
        index % 2 === 1 ? "bg-muted/[0.12]" : "bg-background"
      }`}
    >
      <td className="sticky left-0 z-10 bg-inherit px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.09] text-[10px] font-semibold text-primary">
            {getInitials(student.student_name)}
          </span>

          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium">
              {student.student_name}
            </p>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              ID #{student.student_id}
            </p>
          </div>
        </div>
      </td>

      {columns.map((column) => {
        const mark = student.marks[String(column.id)];

        const value = mark?.mark ?? null;

        const percentage =
          value !== null && column.max_mark > 0
            ? (value / column.max_mark) * 100
            : null;

        return (
          <td key={column.id} className="px-3 py-3 text-center">
            <MarkCell
              value={value}
              maxMark={column.max_mark}
              percentage={percentage}
              notes={mark?.notes}
            />
          </td>
        );
      })}
    </tr>
  );
}

function MarkCell({
  value,
  maxMark,
  percentage,
  notes,
}: {
  value: number | null;
  maxMark: number;
  percentage: number | null;
  notes?: string | null;
}) {
  if (value === null) {
    return (
      <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
        Not graded
      </span>
    );
  }

  let className = "bg-emerald-50 text-emerald-700";

  if (percentage !== null && percentage < 50) {
    className = "bg-rose-50 text-rose-700";
  } else if (percentage !== null && percentage < 70) {
    className = "bg-amber-50 text-amber-700";
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`inline-flex min-w-[58px] items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${className}`}
        title={notes ?? undefined}
      >
        {formatNumber(value)}
        <span className="mx-0.5 opacity-50">/</span>
        {formatNumber(maxMark)}
      </span>

      {percentage !== null && (
        <span className="text-[9px] text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

function EmptyMarksState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="rounded-[26px] border border-dashed border-border/60 bg-card p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary/[0.08] text-primary">
        <Award size={21} />
      </span>

      <h2 className="mt-4 text-[15px] font-semibold">No marks available</h2>

      <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
        There are no student marks available for the current academic year and
        semester.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground"
      >
        <RefreshCw size={14} />
        Refresh
      </button>
    </section>
  );
}

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
    <section className="rounded-[26px] border border-destructive/15 bg-card p-8 text-center">
      <AlertCircle className="mx-auto text-destructive" size={24} />

      <h2 className="mt-3 text-sm font-semibold">{title}</h2>

      {message && (
        <p className="mt-1.5 text-[12px] text-muted-foreground">{message}</p>
      )}

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[12px] font-medium text-primary-foreground"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </section>
  );
}

function MarksPageSkeleton() {
  return (
    <div className="space-y-5">
      <section className="h-[91px] animate-pulse rounded-[26px] border border-border/45 bg-card" />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[92px] animate-pulse rounded-[22px] bg-muted/50"
          />
        ))}
      </section>

      {Array.from({ length: 2 }).map((_, gradeIndex) => (
        <section
          key={gradeIndex}
          className="rounded-[26px] border border-border/45 bg-card p-5"
        >
          <div className="h-10 w-48 animate-pulse rounded-xl bg-muted/50" />

          <div className="mt-5 space-y-4">
            {Array.from({
              length: 2,
            }).map((_, classIndex) => (
              <div
                key={classIndex}
                className="h-[220px] animate-pulse rounded-[22px] bg-muted/30"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatNumber(value: number): string {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.?0+$/, "");
}
