import { useState } from "react";
import {
  FileSpreadsheet,
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

const defaultFilters: StudentListFilters =
  {
    page: 1,
    per_page: 12,
    sort: "asc",
  };

export function StudentsPage() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] =
    useState("");

  const [filters, setFilters] =
    useState<StudentListFilters>(
      defaultFilters,
    );

  const [
    pendingDeleteId,
    setPendingDeleteId,
  ] = useState<ApiId>();

  const [
    pendingToggleId,
    setPendingToggleId,
  ] = useState<ApiId>();

  const normalizedSearch =
    searchValue.trim();

  const isSearchMode =
    normalizedSearch.length >= 2;

  const listQuery =
    useStudents(filters);

  const searchQuery =
    useStudentSearch({
      q: normalizedSearch,
      page: filters.page,
      per_page: filters.per_page,
    });

  const activeQuery = isSearchMode
    ? searchQuery
    : listQuery;

  const deleteMutation =
    useDeleteStudent();

  const toggleMutation =
    useToggleStudentAccount();

  const students =
    activeQuery.data?.data ?? [];

  const pagination =
    activeQuery.data?.meta;

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

  function openStudent(
    student: StudentListItem,
  ) {
    navigate(
      `/users/students/${student.enrollmentId}`,
    );
  }

  async function deleteStudent(
    student: StudentListItem,
  ) {
    const confirmed = window.confirm(
      `Withdraw "${student.fullName}" from the school? The enrollment will be removed and the account will be disabled.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setPendingDeleteId(
        student.enrollmentId,
      );

      await deleteMutation.mutateAsync(
        student.enrollmentId,
      );
    } finally {
      setPendingDeleteId(undefined);
    }
  }

  async function toggleStudent(
    student: StudentListItem,
  ) {
    const isEnabled =
      student.accountStatus ===
        "enabled" ||
      student.accountStatus ===
        "active";

    const nextAction = isEnabled
      ? "disable"
      : "enable";

    const confirmed = window.confirm(
      `Are you sure you want to ${nextAction} "${student.fullName}"'s account?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setPendingToggleId(
        student.enrollmentId,
      );

      await toggleMutation.mutateAsync(
        student.enrollmentId,
      );
    } finally {
      setPendingToggleId(undefined);
    }
  }

  const totalStudents =
    pagination?.total ??
    students.length;

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1650px] flex-col gap-6">
        <StudentPageHeader
          title="Students"
          description="Browse student profiles, review academic placement and manage account actions."
          icon={
            <UsersRound
              size={23}
              strokeWidth={1.7}
            />
          }
          actions={
            <>
              <button
                type="button"
                onClick={() =>
                  void activeQuery.refetch()
                }
                disabled={
                  activeQuery.isFetching
                }
                className={[
                  "inline-flex h-11 items-center gap-2",
                  "rounded-xl border",
                  "border-border/70 bg-card px-4",
                  "text-sm font-medium text-foreground",
                  "transition-all",
                  "hover:border-primary/20",
                  "hover:bg-primary/[0.04]",
                  "hover:text-primary",
                  "disabled:opacity-50",
                ].join(" ")}
              >
                <RefreshCcw
                  size={16}
                  strokeWidth={1.8}
                  className={
                    activeQuery.isFetching
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/users/students/import",
                  )
                }
                className={[
                  "inline-flex h-11 items-center gap-2",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-primary/[0.055]",
                  "px-4 text-sm font-medium",
                  "text-primary transition",
                  "hover:bg-primary/[0.09]",
                ].join(" ")}
              >
                <FileSpreadsheet
                  size={16}
                  strokeWidth={1.8}
                />

                Import students
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/users/students/new",
                  )
                }
                className={[
                  "inline-flex h-11 items-center gap-2",
                  "rounded-xl bg-primary px-5",
                  "text-sm font-medium",
                  "text-primary-foreground",
                  "shadow-sm transition",
                  "hover:bg-primary/90",
                ].join(" ")}
              >
                <Plus
                  size={16}
                  strokeWidth={1.9}
                />

                Add student
              </button>
            </>
          }
        />

        <section
          className={[
            "flex flex-col gap-4",
            "rounded-[20px]",
            "border border-border/60",
            "bg-card p-5",
            "shadow-[0_10px_32px_rgba(30,20,70,0.045)]",
            "sm:flex-row",
            "sm:items-center",
            "sm:justify-between",
          ].join(" ")}
        >
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary/[0.07] text-primary">
              <UsersRound
                size={20}
                strokeWidth={1.7}
              />
            </span>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-muted-foreground">
                Student directory
              </p>

              <div className="mt-1 flex items-end gap-2">
                <strong className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  {totalStudents}
                </strong>

                <span className="pb-0.5 text-xs font-normal text-muted-foreground">
                  total students
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filters.status ? (
              <span className="rounded-full bg-primary/[0.07] px-3 py-1.5 text-[11px] font-medium capitalize text-primary">
                {filters.status}
              </span>
            ) : null}

            {isSearchMode ? (
              <span className="max-w-52 truncate rounded-full bg-muted/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                Search: {normalizedSearch}
              </span>
            ) : null}
          </div>
        </section>

        <StudentsFiltersBar
          searchValue={searchValue}
          filters={filters}
          isFetching={
            activeQuery.isFetching
          }
          onSearchChange={changeSearch}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        {activeQuery.isPending ? (
          <StudentsLoadingGrid />
        ) : activeQuery.isError ? (
          <StudentsErrorState
            onRetry={() =>
              void activeQuery.refetch()
            }
          />
        ) : students.length === 0 ? (
          <StudentsEmptyState
            hasSearch={Boolean(
              normalizedSearch ||
                filters.status,
            )}
            onReset={resetFilters}
            onAddStudent={() =>
              navigate(
                "/users/students/new",
              )
            }
          />
        ) : (
          <section
            aria-label="Student cards"
            className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4"
          >
            {students.map(
              (student, index) => (
                <StudentCard
                  key={
                    student.enrollmentId
                  }
                  student={student}
                  index={index}
                  isDeleting={
                    pendingDeleteId ===
                    student.enrollmentId
                  }
                  isToggling={
                    pendingToggleId ===
                    student.enrollmentId
                  }
                  onView={openStudent}
                  onDelete={
                    deleteStudent
                  }
                  onToggleStatus={
                    toggleStudent
                  }
                />
              ),
            )}
          </section>
        )}

        {pagination ? (
          <StudentsPagination
            currentPage={
              pagination.current_page
            }
            lastPage={
              pagination.last_page
            }
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            disabled={
              activeQuery.isFetching
            }
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

function StudentsErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <section className="rounded-[24px] border border-destructive/15 bg-card px-6 py-16 text-center shadow-[0_14px_45px_rgba(30,20,70,0.06)]">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-destructive/[0.08] text-destructive">
        <UsersRound
          size={25}
          strokeWidth={1.7}
        />
      </span>

      <h2 className="mt-5 text-lg font-semibold text-foreground">
        Students could not be loaded
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-muted-foreground">
        Check your connection and account
        permissions, then try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
      >
        <RefreshCcw
          size={15}
          strokeWidth={1.8}
        />

        Try again
      </button>
    </section>
  );
}