import {
  Edit3,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  UserRoundCheck,
} from "lucide-react";

import { useState } from "react";

import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
import { useGrades } from "@/features/academics/grades/hooks/useGrades";
import {
  useDeleteStudentEnrollment,
  useStudentEnrollments,
} from "@/features/academics/student-enrollments/hooks/useStudentEnrollments";
import { useStudents } from "@/features/users/students/hooks/useStudents";

function getFullName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ") || "—";
}

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    active: "bg-success/10 text-success",
    completed: "bg-primary/10 text-primary",
    transferred: "bg-warning/10 text-warning",
    withdrawn: "bg-destructive/10 text-destructive",
  };

  return classes[status] ?? "bg-muted text-muted-foreground";
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function StudentEnrollmentsPage() {
  const {
    data: enrollments = [],
    isLoading,
    isError,
  } = useStudentEnrollments();

  const { data: students = [] } = useStudents();
  const { data: classrooms = [] } = useClassrooms();
  const { data: grades = [] } = useGrades();

  const deleteMutation = useDeleteStudentEnrollment();
  const [search, setSearch] = useState("");

  function getStudent(studentId: string) {
    return students.find((student) => student.id === studentId);
  }

  function getClassroom(classroomId: string) {
    return classrooms.find((classroom) => classroom.id === classroomId);
  }

  function getGradeName(gradeId?: string) {
    if (!gradeId) return "—";
    return grades.find((grade) => grade.id === gradeId)?.name ?? "—";
  }

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const student = getStudent(enrollment.studentId);
    const classroom = getClassroom(enrollment.classroomId);
    const gradeName = getGradeName(classroom?.gradeId);

    const searchableText = [
      getFullName(student?.firstName, student?.lastName),
      student?.studentCode,
      classroom?.name,
      classroom?.code,
      gradeName,
      enrollment.academicYearId,
      enrollment.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="soft-card rounded-3xl p-5">
        Loading student enrollments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="soft-card rounded-3xl p-5">
        Failed to load student enrollments.
      </div>
    );
  }

  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRoundCheck size={22} />
          </span>

          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.04em] text-foreground">
              Student Enrollments
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Assign students to classrooms and academic years.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-soft"
        >
          <Plus size={15} />
          Add Enrollment
        </button>
      </div>

      <div className="mb-4 flex h-11 items-center gap-3 rounded-2xl border border-border/70 bg-card px-4">
        <Search size={16} className="text-muted-foreground" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search student enrollments..."
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Total Enrollments
          </p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {enrollments.length}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Active
          </p>

          <p className="mt-1 text-xl font-bold text-success">
            {enrollments.filter((item) => item.status === "active").length}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Classrooms
          </p>

          <p className="mt-1 text-xl font-bold text-primary">
            {new Set(enrollments.map((item) => item.classroomId)).size}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Academic Years
          </p>

          <p className="mt-1 text-xl font-bold text-foreground">
            {new Set(enrollments.map((item) => item.academicYearId)).size}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/70 text-[11px] font-bold text-muted-foreground">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Classroom</th>
              <th className="px-4 py-3">Academic Year</th>
              <th className="px-4 py-3">Enrollment Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEnrollments.map((enrollment) => {
              const student = getStudent(enrollment.studentId);
              const classroom = getClassroom(enrollment.classroomId);
              const gradeName = getGradeName(classroom?.gradeId);

              return (
                <tr
                  key={enrollment.id}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <GraduationCap size={15} />
                      </span>

                      <span className="text-xs font-bold text-foreground">
                        {getFullName(student?.firstName, student?.lastName)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {student?.studentCode ?? "—"}
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {gradeName}
                  </td>

                  <td className="px-4 py-3 text-xs font-semibold text-foreground">
                    {classroom?.name ?? "—"}
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {enrollment.academicYearId}
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {enrollment.enrollmentDate}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-[10px] font-bold",
                        getStatusClass(enrollment.status),
                      ].join(" ")}
                    >
                      {formatStatus(enrollment.status)}
                    </span>
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
                        onClick={() =>
                          deleteMutation.mutate(enrollment.id)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 text-destructive transition hover:bg-destructive/10"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredEnrollments.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No student enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}