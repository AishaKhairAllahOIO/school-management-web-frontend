import { BookOpen, Edit3, Plus, Search, Trash2, UserCheck } from "lucide-react";

import { useState } from "react";

import {
  useDeleteTeacherAssignment,
  useTeacherAssignments,
} from "@/features/academics/teacher-assignments/hooks/useTeacherAssignments";
import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
import { useSubjects } from "@/features/academics/subjects/hooks/useSubjects";
import { useTeachers } from "@/features/users/teachers/hooks/useTeachers";

function getFullName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ") || "—";
}

export function TeacherAssignmentsPage() {
  const { data: assignments = [], isLoading, isError } = useTeacherAssignments();
  const { data: classrooms = [] } = useClassrooms();
  const { data: subjects = [] } = useSubjects();
  const { data: teachers = [] } = useTeachers();

  const deleteMutation = useDeleteTeacherAssignment();
  const [search, setSearch] = useState("");

  function getTeacherName(teacherId: string) {
    const teacher = teachers.find((item) => item.id === teacherId);
    return getFullName(teacher?.firstName, teacher?.lastName);
  }

  function getClassroomName(classroomId: string) {
    return classrooms.find((item) => item.id === classroomId)?.name ?? "—";
  }

  function getSubjectName(subjectId: string) {
    return subjects.find((item) => item.id === subjectId)?.name ?? "—";
  }

  const filteredAssignments = assignments.filter((item) => {
    const teacherName = getTeacherName(item.teacherId);
    const classroomName = getClassroomName(item.classroomId);
    const subjectName = getSubjectName(item.subjectId);

    return `${teacherName} ${classroomName} ${subjectName}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="soft-card rounded-3xl p-5">
        Loading teacher assignments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="soft-card rounded-3xl p-5">
        Failed to load teacher assignments.
      </div>
    );
  }

  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserCheck size={22} />
          </span>

          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-foreground">
              Teacher Assignments
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Assign teachers to classrooms and subjects for the academic year.
            </p>
          </div>
        </div>

        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft">
          <Plus size={15} />
          Add Assignment
        </button>
      </div>

      <div className="mb-4 flex h-11 items-center gap-3 rounded-2xl border border-border/70 bg-card px-4">
        <Search size={16} className="text-muted-foreground" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search teacher assignments..."
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Total Assignments
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {assignments.length}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Assigned Teachers
          </p>
          <p className="mt-1 text-xl font-bold text-primary">
            {new Set(assignments.map((item) => item.teacherId)).size}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Covered Subjects
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {new Set(assignments.map((item) => item.subjectId)).size}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/70 text-[11px] font-bold text-muted-foreground">
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Classroom</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Academic Year</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-4 py-3 text-xs font-bold text-foreground">
                  {getTeacherName(item.teacherId)}
                </td>

                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {getClassroomName(item.classroomId)}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                    <BookOpen size={11} />
                    {getSubjectName(item.subjectId)}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {item.academicYearId}
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

            {filteredAssignments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No teacher assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}