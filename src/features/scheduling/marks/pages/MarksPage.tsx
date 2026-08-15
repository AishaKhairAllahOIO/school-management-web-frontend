import { useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
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
      <section className="rounded-[26px] border border-amber-200/60 bg-amber-50/65 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-amber-100 text-amber-700">
          <AlertCircle size={23} />
        </span>

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

  return (
    <div className="space-y-5">
      <PageHeader
        academicYear={currentAcademicYear.name}
        semester={currentTerm.semesterName}
      />

      {marks.grades.length === 0 ? (
        <EmptyMarksState onRetry={() => void marksQuery.refetch()} />
      ) : (
        <div className="space-y-3">
          {marks.grades.map((grade) => (
            <GradeSection key={grade.id} grade={grade} />
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
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-violet-50 text-violet-700">
          <Award size={20} />
        </span>

        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold tracking-[-0.02em]">
            Student Marks
          </h1>

          <p className="mt-1 text-[12px] text-muted-foreground">
            {academicYear} · {semester}
          </p>
        </div>
      </div>
    </section>
  );
}

function GradeSection({
  grade,
}: {
  grade: {
    id: number;
    name: string;
    classes: Array<{
      class_room: {
        id: number;
        name: string;
      };
      subjects: MarkSubject[];
    }>;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);

  const totalSubjects = grade.classes.reduce(
    (total, classItem) => total + classItem.subjects.length,
    0,
  );

  return (
    <section className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.025)]">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-violet-50/35 sm:px-5"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-violet-50 text-violet-700">
          <GraduationCap size={19} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[14px] font-semibold tracking-[-0.01em]">
              {grade.name}
            </h2>

            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-medium text-violet-700">
              {totalSubjects} {totalSubjects === 1 ? "subject" : "subjects"}
            </span>
          </div>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {grade.classes.length}{" "}
            {grade.classes.length === 1 ? "class" : "classes"}
          </p>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-700 transition-colors">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-violet-100/70 bg-violet-50/[0.22] p-3 sm:p-4">
          <div className="space-y-2">
            {grade.classes.map((classItem) => (
              <ClassSection
                key={classItem.class_room.id}
                classItem={classItem}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
function ClassSection({
  classItem,
}: {
  classItem: {
    class_room: {
      id: number;
      name: string;
    };
    subjects: MarkSubject[];
  };
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="overflow-hidden rounded-[20px] border border-sky-200/60 bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-sky-50/45"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-sky-50 text-sky-700">
          <Users size={16} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-semibold">
              {classItem.class_room.name}
            </h3>

            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-medium text-sky-700">
              {classItem.subjects.length}{" "}
              {classItem.subjects.length === 1 ? "subject" : "subjects"}
            </span>
          </div>
        </div>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700">
          {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-sky-100/70 bg-sky-50/[0.16] p-3">
          {classItem.subjects.length === 0 ? (
            <div className="rounded-[16px] bg-muted/25 px-4 py-6 text-center text-[11px] text-muted-foreground">
              No subjects available.
            </div>
          ) : (
            <div className="space-y-2">
              {classItem.subjects.map((subject) => (
                <SubjectSection
                  key={subject.subject_info.grade_subject_id}
                  subject={subject}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function SubjectSection({ subject }: { subject: MarkSubject }) {
  const [isOpen, setIsOpen] = useState(false);

  const columns = subject.columns;
  const students = subject.students;

  return (
    <section className="overflow-hidden rounded-[18px] border border-emerald-200/60 bg-background">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-emerald-50/35"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-700">
          <Award size={14} />
        </span>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[12px] font-semibold">
            {subject.subject_info.subject_name}
          </h4>
        </div>

        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-medium text-emerald-700 sm:inline-flex">
          <CheckCircle2 size={11} />
          Marks
        </span>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-emerald-100/70">
          {columns.length === 0 ? (
            <div className="p-6 text-center text-[11px] text-muted-foreground">
              No assessment components available.
            </div>
          ) : students.length === 0 ? (
            <div className="p-6 text-center text-[11px] text-muted-foreground">
              No students found in this class.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border/45 bg-muted/25">
                    <th className="sticky left-0 z-10 min-w-[220px] bg-muted/25 px-4 py-3 text-[10px] font-semibold text-foreground/70">
                      Student
                    </th>

                    {columns.map((column) => (
                      <th
                        key={column.id}
                        className="min-w-[115px] px-3 py-3 text-center text-[10px] font-semibold text-foreground/70"
                      >
                        <div>{column.name}</div>

                        <div className="mt-0.5 text-[9px] font-normal text-muted-foreground">
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
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[10px] font-semibold text-violet-700">
            {getInitials(student.student_name)}
          </span>

          <p className="truncate text-[12px] font-medium">
            {student.student_name}
          </p>
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
    <section className="rounded-[26px] border border-dashed border-violet-200/70 bg-violet-50/[0.35] p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-violet-50 text-violet-700">
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
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-medium text-primary-foreground transition hover:opacity-90"
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
    <section className="rounded-[26px] border border-rose-200/60 bg-rose-50/[0.35] p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-rose-50 text-rose-700">
        <AlertCircle size={24} />
      </span>

      <h2 className="mt-3 text-sm font-semibold">{title}</h2>

      {message && (
        <p className="mt-1.5 text-[12px] text-muted-foreground">{message}</p>
      )}

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[12px] font-medium text-primary-foreground transition hover:opacity-90"
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
      {/* Header */}
      <section className="rounded-[26px] border border-border/45 bg-card p-4 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 animate-pulse rounded-[15px] bg-violet-100" />

          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded-md bg-violet-100" />

            <div className="h-3 w-48 animate-pulse rounded-md bg-violet-50" />
          </div>
        </div>
      </section>

      {/* Grades */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <section
            key={index}
            className="rounded-[24px] border border-border/45 bg-card shadow-[0_8px_28px_rgba(30,20,70,0.025)]"
          >
            <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
              <div className="h-10 w-10 animate-pulse rounded-[13px] bg-violet-100" />

              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-28 animate-pulse rounded-md bg-violet-100" />

                <div className="h-2.5 w-36 animate-pulse rounded-md bg-muted/40" />
              </div>

              <div className="h-8 w-8 animate-pulse rounded-full bg-violet-50" />
            </div>
          </section>
        ))}
      </div>
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
