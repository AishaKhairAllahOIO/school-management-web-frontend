import {
  useState,
} from "react";
import {
  LayoutGrid,
  Plus,
  RefreshCcw,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ApiId } from "../../shared/types/api.types";
import { StudentCard } from "../components/list/StudentCard";
import { StudentsEmptyState } from "../components/list/StudentsEmptyState";
import { StudentsFiltersBar } from "../components/list/StudentFiltersBar";
import { StudentsLoadingGrid } from "../components/list/StudentsLoadingGrid";
import { StudentsPagination } from "../components/list/StudentsPagination";
import { StudentPageHeader } from "../components/shared/StudentPageHeader";
import {
  useDeleteStudent,
  useStudentSearch,
  useStudents,
  useToggleStudentAccount,
} from "../hooks/useStudents";
import type {
  StudentListFilters,
  StudentListItem,
} from "../types/student.types";

const defaultFilters: StudentListFilters = {
  page: 1,
  per_page: 12,
  sort: "asc",
};

export function StudentsPage() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] =
    useState<StudentListFilters>(defaultFilters);
  const [pendingDeleteId, setPendingDeleteId] =
    useState<ApiId>();
  const [pendingToggleId, setPendingToggleId] =
    useState<ApiId>();

  const normalizedSearch = searchValue.trim();
  const isSearchMode = normalizedSearch.length >= 2;

  const listQuery = useStudents(filters);
  const searchQuery = useStudentSearch({
    q: normalizedSearch,
    page: filters.page,
    per_page: filters.per_page,
  });

  const activeQuery = isSearchMode
    ? searchQuery
    : listQuery;

  const deleteMutation = useDeleteStudent();
  const toggleMutation = useToggleStudentAccount();

  const students = activeQuery.data?.data ?? [];
  const pagination = activeQuery.data?.meta;

  function changeSearch(value: string) {
    setSearchValue(value);
    setFilters((current) => ({
      ...current,
      page: 1,
    }));
  }

  function resetFilters() {
    setSearchValue("");
    setFilters(defaultFilters);
  }

  function openStudent(student: StudentListItem) {
    navigate(`/users/students/${student.enrollmentId}`);
  }

  async function deleteStudent(student: StudentListItem) {
    const confirmed = window.confirm(
      `Delete "${student.fullName}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setPendingDeleteId(student.studentId);
      await deleteMutation.mutateAsync(student.studentId);
    } finally {
      setPendingDeleteId(undefined);
    }
  }

  async function toggleStudent(student: StudentListItem) {
    const confirmed = window.confirm(
      `Change the account status for "${student.fullName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setPendingToggleId(student.enrollmentId);
      await toggleMutation.mutateAsync(student.enrollmentId);
    } finally {
      setPendingToggleId(undefined);
    }
  }


  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1650px] flex-col gap-6">
        <StudentPageHeader
          title="Students"
          description="Browse student profiles, manage enrollment, and handle account actions from one visual workspace."
          icon={<UsersRound className="h-7 w-7" />}
          actions={
            <>
              <button
                type="button"
                onClick={() => void activeQuery.refetch()}
                disabled={activeQuery.isFetching}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:border-primary/25 hover:bg-secondary disabled:opacity-50"
              >
                <RefreshCcw
                  className={[
                    "h-4 w-4",
                    activeQuery.isFetching
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => navigate("/users/students/import")}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-primary/15 bg-primary/10 px-4 text-sm font-bold text-primary transition hover:bg-primary/15"
              >
                Import
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/users/students/new")
                }
                className="primary-gradient inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-auth-button)] transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                Add student
              </button>
            </>
          }
        />

        <section className="flex flex-col gap-3 rounded-[28px] border border-border/70 bg-card/70 p-4 shadow-[var(--shadow-card)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Student directory
            </p>
            <div className="mt-1 flex items-end gap-2">
              <strong className="text-3xl font-black tracking-tight text-foreground">
                {pagination?.total ?? students.length}
              </strong>
              <span className="pb-1 text-sm font-semibold text-muted-foreground">
                total students
              </span>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <LayoutGrid className="h-4 w-4" />
            Pinterest view
          </div>
        </section>

        <StudentsFiltersBar
          searchValue={searchValue}
          filters={filters}
          isFetching={activeQuery.isFetching}
          onSearchChange={changeSearch}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        {activeQuery.isPending ? (
          <StudentsLoadingGrid />
        ) : activeQuery.isError ? (
          <section className="rounded-[32px] border border-destructive/20 bg-card px-6 py-20 text-center shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-black text-destructive">
              Students could not be loaded
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Check your connection and account permissions,
              then try again.
            </p>

            <button
              type="button"
              onClick={() => void activeQuery.refetch()}
              className="primary-gradient mt-5 rounded-2xl px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              Try again
            </button>
          </section>
        ) : students.length === 0 ? (
          <StudentsEmptyState
            hasSearch={Boolean(
              normalizedSearch || filters.status,
            )}
            onReset={resetFilters}
            onAddStudent={() =>
              navigate("/users/students/new")
            }
          />
        ) : (
          <section
            aria-label="Student cards"
            className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4"
          >
            {students.map((student, index) => (
              <StudentCard
                key={student.enrollmentId}
                student={student}
                index={index}
                isDeleting={
                  pendingDeleteId === student.studentId
                }
                isToggling={
                  pendingToggleId ===
                  student.enrollmentId
                }
                onView={openStudent}
                onDelete={deleteStudent}
                onToggleStatus={toggleStudent}
              />
            ))}
          </section>
        )}

        {pagination ? (
          <StudentsPagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            disabled={activeQuery.isFetching}
            onPageChange={(page) => {
              setFilters((current) => ({
                ...current,
                page,
              }));

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        ) : null}
      </div>
    </main>
  );
}
