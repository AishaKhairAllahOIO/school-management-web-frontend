import {
  Edit3,
  Eye,
  MoreVertical,
  Power,
  Search,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { StudentImportPanel } from "../components/StudentImportPanel";
import { StudentRegistrationDialog } from "../components/StudentRegistrationDialog";
import {
  useDeleteStudent,
  useStudents,
  useToggleStudentStatus,
} from "../hooks/useStudents";
import type {
  StudentListFilters,
  StudentListItem,
} from "../types/student-api.types";

export function StudentsPage() {
  const [searchValue, setSearchValue] =
    useState("");

  const [gradeLevelId, setGradeLevelId] =
    useState("");

  const [classroomId, setClassroomId] =
    useState("");

  const [sort, setSort] =
    useState<"asc" | "desc">("asc");

  const [
    isRegistrationOpen,
    setIsRegistrationOpen,
  ] = useState(false);

  const [isImportOpen, setIsImportOpen] =
    useState(false);

  const filters =
    useMemo<StudentListFilters>(
      () => ({
        search:
          searchValue.trim() || undefined,

        gradeLevelId: gradeLevelId
          ? Number(gradeLevelId)
          : undefined,

        classroomId: classroomId
          ? Number(classroomId)
          : undefined,

        sort,
        perPage: 25,
      }),
      [
        searchValue,
        gradeLevelId,
        classroomId,
        sort,
      ],
    );

  const {
    data: students = [],
    isLoading,
    isError,
    refetch,
  } = useStudents(filters);

  const deleteStudentMutation =
    useDeleteStudent();

  const toggleStatusMutation =
    useToggleStudentStatus();

  function handleDelete(
    student: StudentListItem,
  ) {
    const confirmed = window.confirm(
      `Remove ${student.fullName} from the system?`,
    );

    if (!confirmed) {
      return;
    }

    deleteStudentMutation.mutate(
      student.studentId,
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Students
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage student records, guardians and
            academic enrollment.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setIsImportOpen(true)
            }
            className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground transition hover:bg-muted"
          >
            <Upload size={17} />
            Import Excel
          </button>

          <button
            type="button"
            onClick={() =>
              setIsRegistrationOpen(true)
            }
            className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            <UserPlus size={17} />
            Add Student
          </button>
        </div>
      </header>

      <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_180px_180px_140px]">
          <label className="relative block">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={searchValue}
              onChange={(event) =>
                setSearchValue(
                  event.target.value,
                )
              }
              placeholder="Search students..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </label>

          <input
            type="number"
            min={1}
            value={gradeLevelId}
            onChange={(event) =>
              setGradeLevelId(
                event.target.value,
              )
            }
            placeholder="Grade ID"
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />

          <input
            type="number"
            min={1}
            value={classroomId}
            onChange={(event) =>
              setClassroomId(
                event.target.value,
              )
            }
            placeholder="Classroom ID"
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />

          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as
                  | "asc"
                  | "desc",
              )
            }
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none"
          >
            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
        {isLoading ? (
          <div className="p-10 text-center text-sm font-semibold text-muted-foreground">
            Loading students...
          </div>
        ) : isError ? (
          <div className="p-10 text-center">
            <p className="text-sm font-bold text-destructive">
              Failed to load students.
            </p>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="mt-4 h-10 rounded-xl border border-border px-5 text-xs font-bold text-foreground hover:bg-muted"
            >
              Try Again
            </button>
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center text-sm font-semibold text-muted-foreground">
            No students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-muted/40">
                <tr className="border-b border-border text-left">
                  <TableHeader>
                    Student
                  </TableHeader>

                  <TableHeader>
                    Grade
                  </TableHeader>

                  <TableHeader>
                    Classroom
                  </TableHeader>

                  <TableHeader>
                    Student ID
                  </TableHeader>

                  <TableHeader>
                    Guardian ID
                  </TableHeader>

                  <TableHeader>
                    Enrollment ID
                  </TableHeader>

                  <TableHeader>
                    Actions
                  </TableHeader>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.studentId}
                    className="border-b border-border/70 last:border-0"
                  >
                    <TableCell>
                      <div>
                        <p className="font-bold text-foreground">
                          {student.fullName}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          User #{student.userId}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {student.grade?.name ??
                        "—"}
                    </TableCell>

                    <TableCell>
                      {student.classroom?.name ??
                        "—"}
                    </TableCell>

                    <TableCell>
                      {student.studentId}
                    </TableCell>

                    <TableCell>
                      {student.guardianId}
                    </TableCell>

                    <TableCell>
                      {student.enrollmentId}
                    </TableCell>

                    <TableCell>
                      <StudentActions
                        student={student}
                        disabled={
                          deleteStudentMutation.isPending ||
                          toggleStatusMutation.isPending
                        }
                        onDelete={() =>
                          handleDelete(student)
                        }
                        onToggleStatus={() =>
                          toggleStatusMutation.mutate(
                            student.studentId,
                          )
                        }
                      />
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <StudentRegistrationDialog
        open={isRegistrationOpen}
        onClose={() =>
          setIsRegistrationOpen(false)
        }
      />

      <StudentImportPanel
        open={isImportOpen}
        onClose={() =>
          setIsImportOpen(false)
        }
      />
    </div>
  );
}

function StudentActions({
  student,
  disabled,
  onDelete,
  onToggleStatus,
}: {
  student: StudentListItem;
  disabled: boolean;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Student actions"
        disabled={disabled}
        onClick={() =>
          setOpen((current) => !current)
        }
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:opacity-50"
      >
        <MoreVertical size={17} />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-30 w-48 rounded-2xl border border-border bg-card p-2 shadow-xl">
          <button
            type="button"
            disabled
            title="Student details will be connected in the next step."
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-muted-foreground opacity-50"
          >
            <Eye size={15} />
            View Details
          </button>

          <button
            type="button"
            disabled
            title="Student editing will be connected in the next step."
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-muted-foreground opacity-50"
          >
            <Edit3 size={15} />
            Edit Student
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onToggleStatus();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-warning hover:bg-warning/10"
          >
            <Power size={15} />
            Toggle Account Status
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={15} />
            Remove Student
          </button>

          <p className="sr-only">
            Student {student.fullName}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-xs font-bold text-muted-foreground">
      {children}
    </th>
  );
}

function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-5 py-4 text-sm font-semibold text-foreground">
      {children}
    </td>
  );
}