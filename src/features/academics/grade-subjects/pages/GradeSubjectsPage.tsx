import { BookOpenCheck, Edit3, Plus, Search, Trash2 } from "lucide-react";

import { useState } from "react";

import {
  useDeleteGradeSubject,
  useGradeSubjects,
} from "@/features/academics/grade-subjects/hooks/useGradeSubjects";
import { useGrades } from "@/features/academics/grades/hooks/useGrades";
import { useSubjects } from "@/features/academics/subjects/hooks/useSubjects";

export function GradeSubjectsPage() {
  const { data: gradeSubjects = [], isLoading, isError } = useGradeSubjects();
  const { data: grades = [] } = useGrades();
  const { data: subjects = [] } = useSubjects();

  const deleteMutation = useDeleteGradeSubject();
  const [search, setSearch] = useState("");

  function getGradeName(gradeId: string) {
    return grades.find((grade) => grade.id === gradeId)?.name ?? "—";
  }

  function getSubjectName(subjectId: string) {
    return subjects.find((subject) => subject.id === subjectId)?.name ?? "—";
  }

  const filteredItems = gradeSubjects.filter((item) => {
    const gradeName = getGradeName(item.gradeId);
    const subjectName = getSubjectName(item.subjectId);

    return `${gradeName} ${subjectName}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="soft-card rounded-3xl p-5">
        Loading grade subjects...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="soft-card rounded-3xl p-5">
        Failed to load grade subjects.
      </div>
    );
  }

  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpenCheck size={22} />
          </span>

          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-foreground">
              Grade Subjects
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Link subjects to grades and define weekly teaching hours.
            </p>
          </div>
        </div>

        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft">
          <Plus size={15} />
          Add Grade Subject
        </button>
      </div>

      <div className="mb-4 flex h-11 items-center gap-3 rounded-2xl border border-border/70 bg-card px-4">
        <Search size={16} className="text-muted-foreground" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search grade subjects..."
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Total Links
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {gradeSubjects.length}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Core Subjects
          </p>
          <p className="mt-1 text-xl font-bold text-primary">
            {gradeSubjects.filter((item) => item.isCore).length}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Weekly Hours
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {gradeSubjects.reduce((total, item) => total + item.weeklyHours, 0)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/70 text-[11px] font-bold text-muted-foreground">
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Weekly Hours</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-4 py-3 text-xs font-bold text-foreground">
                  {getGradeName(item.gradeId)}
                </td>

                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {getSubjectName(item.subjectId)}
                </td>

                <td className="px-4 py-3 text-xs font-semibold text-foreground">
                  {item.weeklyHours} hrs
                </td>

                <td className="px-4 py-3">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-[10px] font-bold",
                      item.isCore
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {item.isCore ? "Core" : "Optional"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-[10px] font-bold",
                      item.isActive
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                      <Edit3 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No grade subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}