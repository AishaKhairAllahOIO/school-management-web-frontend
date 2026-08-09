
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Layers3,
  Search,
  Settings2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAcademicTerms } from "@/features/settings/academic/hooks/useAcademicSettings";

import { useClassrooms } from "../../classrooms/hooks/useClassrooms";
import { useGradeSubjects } from "../../grade-subjects/hooks/useGradeSubjects";
import { useGrades } from "../../grades/hooks/useGrades";

type GradeWithState = {
  id: string;
  name: string;
  level?: number | null;
};

function getId(value: unknown): string {
  return String(value ?? "");
}

export function CurriculumOverviewPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedTermId, setSelectedTermId] = useState("");
  const [expandedGrades, setExpandedGrades] = useState<
    Record<string, boolean>
  >({});

  const gradesQuery = useGrades();
  const classroomsQuery = useClassrooms();
  const gradeSubjectsQuery = useGradeSubjects();
  const termsQuery = useAcademicTerms();

  const grades = gradesQuery.data ?? [];
  const classrooms = classroomsQuery.data ?? [];
  const gradeSubjects = gradeSubjectsQuery.data ?? [];
  const terms = termsQuery.data ?? [];

  const isLoading =
    gradesQuery.isLoading ||
    classroomsQuery.isLoading ||
    gradeSubjectsQuery.isLoading ||
    termsQuery.isLoading;

  const isError =
    gradesQuery.isError ||
    classroomsQuery.isError ||
    gradeSubjectsQuery.isError ||
    termsQuery.isError;

  const filteredGrades = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return grades;
    }

    return grades.filter((grade) =>
      String(grade.name ?? "")
        .toLowerCase()
        .includes(query),
    );
  }, [grades, search]);


 

  const toggleGrade = (gradeId: string) => {
    setExpandedGrades((current) => ({
      ...current,
      [gradeId]: !current[gradeId],
    }));
  };

  if (isLoading) {
    return <CurriculumOverviewSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-5">
        <section className="rounded-[20px] border border-pink-200/70 bg-pink-50/60 px-5 py-6 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-[12px] bg-pink-100 text-pink-700">
            <GraduationCap className="h-5 w-5" />
          </span>

          <h2 className="mt-3 text-base font-semibold text-foreground">
            Curriculum data could not be loaded
          </h2>

          <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-muted-foreground">
            Check the academic data connection and try again.
          </p>

          <button
            type="button"
            onClick={() => {
              void gradesQuery.refetch();
              void classroomsQuery.refetch();
              void gradeSubjectsQuery.refetch();
              void termsQuery.refetch();
            }}
            className="mt-4 rounded-[9px] border border-pink-300 bg-pink-100 px-3.5 py-2 text-[11px] font-semibold text-pink-700 transition-colors hover:bg-pink-200"
          >
            Try Again
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="rounded-[20px] border border-pink-200/70 bg-pink-50/60 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-pink-700">
              <GraduationCap className="h-4.5 w-4.5" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                Curriculum
              </span>
            </div>

            <h1 className="mt-1.5 text-[22px] font-semibold tracking-[-0.035em] text-pink-800 sm:text-[25px]">
              Curriculum Overview
            </h1>

            <p className="mt-1 max-w-2xl text-[12px] leading-5 text-black/65">
              Explore grades, classrooms, subjects, academic terms and
              assessment information in one organized view.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/academics")}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-[9px] border border-pink-300 bg-pink-100 px-3.5 text-[11px] font-medium text-pink-700 transition-colors hover:bg-pink-200"
          >
            Back to Academics
          </button>
        </div>
      </header>

      {/* Search & Filters */}
      <section className="rounded-[17px] border border-pink-200/70 bg-pink-50/45 p-3 shadow-[var(--shadow-card)]">
        <div className="grid gap-2.5 md:grid-cols-[1fr_190px_190px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-pink-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search grades..."
              className="h-9 w-full rounded-[9px] border border-pink-200 bg-white px-3 ps-9 text-[11px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </label>

          <select
            value={selectedYearId}
            onChange={(event) => setSelectedYearId(event.target.value)}
            className="h-9 rounded-[9px] border border-pink-200 bg-white px-3 text-[11px] text-foreground outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          >
            <option value="">All academic years</option>

            {Array.from(
              new Map(
                terms.map((term) => [
                  getId(term.academicYearId),
                  term.semesterName,
                ]),
              ),
            ).map(([id, name]) => (
              <option key={id} value={id}>
                {name || id}
              </option>
            ))}
          </select>

          <select
            value={selectedTermId}
            onChange={(event) => setSelectedTermId(event.target.value)}
            className="h-9 rounded-[9px] border border-pink-200 bg-white px-3 text-[11px] text-foreground outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          >
            <option value="">All academic terms</option>

            {terms
              .filter(
                (term) =>
                  !selectedYearId ||
                  getId(term.academicYearId) === selectedYearId,
              )
              .map((term) => (
                <option key={getId(term.id)} value={getId(term.id)}>
                  {term.semesterName?.replaceAll("_", " ")}
                </option>
              ))}
          </select>
        </div>
      </section>

      {/* Grades */}
      <section className="space-y-2.5">
        {filteredGrades.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-pink-200 bg-pink-50/45 px-6 py-10 text-center">
            <BookOpen className="mx-auto h-6 w-6 text-pink-500" />

            <h3 className="mt-2.5 text-sm font-semibold text-foreground">
              No grades found
            </h3>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          filteredGrades.map((grade) => {
            const gradeId = getId(grade.id);

            const gradeClassrooms = classrooms.filter(
              (classroom) => getId(classroom.gradeId) === gradeId,
            );

            const gradeSubjectsForGrade = gradeSubjects.filter(
              (item) =>
                getId(item.gradeId) === gradeId &&
                (!selectedTermId ||
                  getId(item.academicTermId) === selectedTermId),
            );

            return (
              <GradeOverviewCard
                key={gradeId}
                grade={grade}
                classrooms={gradeClassrooms}
                subjects={gradeSubjectsForGrade}
                expanded={expandedGrades[gradeId] ?? false}
                onToggle={() => toggleGrade(gradeId)}
              />
            );
          })
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Grade Card                                                                  */
/* -------------------------------------------------------------------------- */

function GradeOverviewCard({
  grade,
  classrooms,
  subjects,
  expanded,
  onToggle,
}: {
  grade: GradeWithState;
  classrooms: Array<{
    id: string | number;
    name?: string | null;
    currentStudentsCount?: number | null;
    availableSeats?: number | null;
  }>;
  subjects: Array<{
    id: string | number;
    subjectName?: string | null;
    weeklyPeriods?: number | null;
    maxMark?: number | null;
    passingMark?: number | null;
    difficulty?: string | null;
    isFailingSubject?: boolean | null;
  }>;
  expanded: boolean;
  onToggle: () => void;
}) {
  const studentCount = classrooms.reduce(
    (sum, classroom) =>
      sum + Number(classroom.currentStudentsCount ?? 0),
    0,
  );

  const availableSeats = classrooms.reduce(
    (sum, classroom) =>
      sum + Number(classroom.availableSeats ?? 0),
    0,
  );

  const weeklyPeriods = subjects.reduce(
    (sum, subject) =>
      sum + Number(subject.weeklyPeriods ?? 0),
    0,
  );

  const failingSubjects = subjects.filter(
    (subject) => subject.isFailingSubject,
  ).length;

  return (
    <article className="overflow-hidden rounded-[18px] border border-pink-200/80 bg-pink-50/55 shadow-[var(--shadow-card)] transition-all duration-200 hover:border-pink-300">
      {/* Grade Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-start transition-colors hover:bg-pink-100/45 sm:px-5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-pink-100 text-pink-700">
            <GraduationCap className="h-4.5 w-4.5" />
          </span>

          <div className="min-w-0">
            <h2 className="truncate text-[14px] font-semibold text-pink-800">
              {grade.name}
            </h2>

            <p className="mt-0.5 text-[10.5px] text-black/55">
              {classrooms.length} classrooms · {subjects.length} subjects ·{" "}
              {studentCount} students
            </p>
          </div>
        </div>

        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border border-pink-200 bg-white/70 text-pink-700">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      {expanded ? (
        <div className="border-t border-pink-200/70 bg-white/45 p-3.5 sm:p-4">
          {/* Grade summary */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <GradeInfo
              icon={<UsersIcon />}
              label="Students"
              value={studentCount}
            />

            <GradeInfo
              icon={<Layers3 className="h-3.5 w-3.5" />}
              label="Classrooms"
              value={classrooms.length}
            />

            <GradeInfo
              icon={<Layers3 className="h-3.5 w-3.5" />}
              label="Available Seats"
              value={availableSeats}
            />

            <GradeInfo
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="Weekly Periods"
              value={weeklyPeriods}
            />
          </div>

          {/* Subject status */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-pink-200 bg-pink-100 px-2.5 py-1 text-[9px] font-semibold text-pink-700">
              {subjects.length} subjects
            </span>

            <span className="rounded-full border border-pink-200 bg-white px-2.5 py-1 text-[9px] font-medium text-pink-700">
              {weeklyPeriods} weekly periods
            </span>

            {failingSubjects > 0 ? (
              <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[9px] font-semibold text-rose-600">
                {failingSubjects} failing subject
                {failingSubjects > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-[9px] font-medium text-pink-700">
                No failing subjects
              </span>
            )}
          </div>

          {/* Content */}
          <div className="mt-3 grid gap-3 xl:grid-cols-[0.78fr_1.22fr]">
            {/* Classrooms */}
            <OverviewPanel
              title="Classrooms"
              icon={<Layers3 className="h-3.5 w-3.5" />}
            >
              {classrooms.length === 0 ? (
                <EmptyPanelText text="No classrooms assigned." />
              ) : (
                <div className="space-y-1.5">
                  {classrooms.map((classroom) => (
                    <div
                      key={getId(classroom.id)}
                      className="rounded-[12px] border border-pink-100 bg-white/75 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] font-semibold text-foreground">
                          {classroom.name || "Unnamed classroom"}
                        </span>

                        <span className="shrink-0 rounded-full bg-pink-100 px-2 py-0.5 text-[8.5px] font-semibold text-pink-700">
                          {classroom.currentStudentsCount ?? 0} students
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[9.5px] text-muted-foreground">
                        <span>Available seats</span>

                        <span className="font-semibold text-pink-700">
                          {classroom.availableSeats ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </OverviewPanel>

            {/* Subjects */}
            <OverviewPanel
              title="Subjects & Marks"
              icon={<BookOpen className="h-3.5 w-3.5" />}
            >
              {subjects.length === 0 ? (
                <EmptyPanelText text="No subjects assigned." />
              ) : (
                <div className="overflow-hidden rounded-[12px] border border-pink-100 bg-white/75">
                  <div className="hidden grid-cols-[minmax(0,1fr)_70px_75px_75px] gap-2 border-b border-pink-100 bg-pink-50 px-3 py-2 text-[8.5px] font-semibold uppercase tracking-[0.06em] text-pink-700 sm:grid">
                    <span>Subject</span>
                    <span>Periods</span>
                    <span>Max Mark</span>
                    <span>Passing</span>
                  </div>

                  <div className="divide-y divide-pink-100">
                    {subjects.map((subject) => (
                      <div
                        key={getId(subject.id)}
                        className="grid gap-2 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_70px_75px_75px] sm:items-center"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[11px] font-medium text-foreground">
                              {subject.subjectName || "Unnamed subject"}
                            </p>

                            {subject.isFailingSubject ? (
                              <span className="shrink-0 rounded-full bg-rose-50 px-1.5 py-0.5 text-[7.5px] font-semibold text-rose-600">
                                Failing
                              </span>
                            ) : null}
                          </div>

                          {subject.difficulty ? (
                            <p className="mt-0.5 text-[8.5px] text-muted-foreground">
                              Difficulty: {subject.difficulty}
                            </p>
                          ) : null}
                        </div>

                        <DataValue
                          label="Periods"
                          value={subject.weeklyPeriods ?? "—"}
                        />

                        <DataValue
                          label="Max"
                          value={subject.maxMark ?? "—"}
                        />

                        <DataValue
                          label="Passing"
                          value={subject.passingMark ?? "—"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </OverviewPanel>
          </div>

          {/* Assessment placeholder */}
          <div className="mt-3">
            <div className="rounded-[13px] border border-pink-200 bg-pink-50/60 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-pink-100 text-pink-700">
                  <Settings2 className="h-3.5 w-3.5" />
                </span>

                <div>
                  <p className="text-[10px] font-semibold text-pink-800">
                    Assessment Structure
                  </p>

                  <p className="mt-0.5 text-[9px] text-black/55">
                    Assessment components and grade configuration can be
                    displayed here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}


function GradeInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[12px] border border-pink-100 bg-white/70 px-2.5 py-2">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-pink-100 text-pink-700">
          {icon}
        </span>

        <div>
          <p className="text-[8.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
            {label}
          </p>

          <p className="mt-0.5 text-[12px] font-semibold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function OverviewPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[14px] border border-pink-100 bg-white/55 p-3">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-pink-100 text-pink-700">
          {icon}
        </span>

        <h3 className="text-[11px] font-semibold text-pink-800">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

function DataValue({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-2 sm:block">
      <span className="text-[8.5px] text-muted-foreground sm:block">
        {label}
      </span>

      <span className="text-[10px] font-semibold text-pink-700 sm:mt-0.5 sm:block">
        {value}
      </span>
    </div>
  );
}

function EmptyPanelText({ text }: { text: string }) {
  return (
    <div className="rounded-[10px] border border-dashed border-pink-200 bg-pink-50/50 px-3 py-4 text-center text-[9.5px] text-muted-foreground">
      {text}
    </div>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                    */
/* -------------------------------------------------------------------------- */

function CurriculumOverviewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <section className="rounded-[20px] border border-pink-200/70 bg-pink-50/55 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-[10px] bg-pink-100" />

          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-20 animate-pulse rounded-full bg-pink-100" />

            <div className="h-5 w-48 animate-pulse rounded-md bg-pink-100" />

            <div className="h-2.5 w-80 max-w-full animate-pulse rounded-full bg-pink-100" />
          </div>
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[66px] animate-pulse rounded-[15px] border border-pink-200/70 bg-pink-50/55"
          />
        ))}
      </section>

      {/* Filters Skeleton */}
      <section className="rounded-[17px] border border-pink-200/70 bg-pink-50/55 p-3">
        <div className="grid gap-2.5 md:grid-cols-[1fr_190px_190px]">
          <div className="h-9 animate-pulse rounded-[9px] bg-pink-100" />
          <div className="h-9 animate-pulse rounded-[9px] bg-pink-100" />
          <div className="h-9 animate-pulse rounded-[9px] bg-pink-100" />
        </div>
      </section>

      {/* Grade Skeletons */}
      <section className="space-y-2.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[64px] animate-pulse rounded-[18px] border border-pink-200/70 bg-pink-50/55"
          />
        ))}
      </section>
    </div>
  );
}
