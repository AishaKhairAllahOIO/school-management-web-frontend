import {
  Award,
  BookOpen,
  Edit3,
  GraduationCap,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
import {
  useDeleteGradeBookEntry,
  useGradeBookEntries,
} from "@/features/academics/grade-book/hooks/useGradeBook";
import { useSubjects } from "@/features/academics/subjects/hooks/useSubjects";
import { useStudents } from "@/features/users/students/hooks/useStudents";

function getFullName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ") || "—";
}

function formatAssessmentType(type: string) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPercentage(score: number, maxScore: number) {
  if (!maxScore) return 0;
  return Math.round((score / maxScore) * 100);
}

function getScoreClass(percentage: number) {
  if (percentage >= 90) return "bg-success/10 text-success";
  if (percentage >= 75) return "bg-info/10 text-info";
  if (percentage >= 60) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

export function GradeBookPage() {
  const { data: entries = [], isLoading, isError } = useGradeBookEntries();
  const { data: students = [] } = useStudents();
  const { data: classrooms = [] } = useClassrooms();
  const { data: subjects = [] } = useSubjects();

  const deleteMutation = useDeleteGradeBookEntry();
  const [search, setSearch] = useState("");

  function getStudent(studentId: string) {
    return students.find((student) => student.id === studentId);
  }

  function getClassroomName(classroomId: string) {
    return classrooms.find((classroom) => classroom.id === classroomId)?.name ?? "—";
  }

  function getSubjectName(subjectId: string) {
    return subjects.find((subject) => subject.id === subjectId)?.name ?? "—";
  }

  const filteredEntries = entries.filter((entry) => {
    const student = getStudent(entry.studentId);

    const searchableText = [
      getFullName(student?.firstName, student?.lastName),
      student?.studentCode,
      getClassroomName(entry.classroomId),
      getSubjectName(entry.subjectId),
      entry.assessmentTitle,
      entry.assessmentType,
      entry.academicYearId,
      entry.termId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  const averageScore =
    entries.length === 0
      ? 0
      : Math.round(
          entries.reduce(
            (total, entry) => total + getPercentage(entry.score, entry.maxScore),
            0
          ) / entries.length
        );

  if (isLoading) {
    return (
      <div className="soft-card rounded-3xl p-5">
        Loading grade book entries...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="soft-card rounded-3xl p-5">
        Failed to load grade book entries.
      </div>
    );
  }

  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Award size={22} />
          </span>

          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-foreground">
              Grade Book
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Track student scores, assessments, subjects, and academic terms.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft"
        >
          <Plus size={15} />
          Add Mark
        </button>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Total Marks
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {entries.length}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Average Score
          </p>
          <p className="mt-1 text-xl font-bold text-primary">
            {averageScore}%
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Students
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {new Set(entries.map((entry) => entry.studentId)).size}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Subjects
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {new Set(entries.map((entry) => entry.subjectId)).size}
          </p>
        </div>
      </div>

      <div className="mb-4 flex h-11 items-center gap-3 rounded-2xl border border-border/70 bg-card px-4">
        <Search size={16} className="text-muted-foreground" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search grade book..."
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/70 text-[11px] font-bold text-muted-foreground">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Classroom</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Assessment</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Term</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEntries.map((entry) => {
              const student = getStudent(entry.studentId);
              const percentage = getPercentage(entry.score, entry.maxScore);

              return (
                <tr
                  key={entry.id}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <GraduationCap size={15} />
                      </span>

                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {getFullName(student?.firstName, student?.lastName)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {student?.studentCode ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {getClassroomName(entry.classroomId)}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                      <BookOpen size={11} />
                      {getSubjectName(entry.subjectId)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs font-semibold text-foreground">
                    {entry.assessmentTitle}
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatAssessmentType(entry.assessmentType)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-[10px] font-bold",
                        getScoreClass(percentage),
                      ].join(" ")}
                    >
                      {entry.score}/{entry.maxScore} · {percentage}%
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {entry.termId}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      >
                        <Edit3 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(entry.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-destructive transition hover:bg-destructive/10"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredEntries.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No grade book entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}