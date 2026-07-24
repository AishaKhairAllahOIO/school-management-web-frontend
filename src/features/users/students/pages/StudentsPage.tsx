import { useState } from "react";

import {
  ArrowLeft,
  ArrowUpAZ,
  Download,
  Filter,
  GraduationCap,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { ApiId } from "../../shared/types/api.types";

import { StudentCard } from "../components/list/StudentCard";
import { StudentsEmptyState } from "../components/list/StudentsEmptyState";
import { StudentsLoadingGrid } from "../components/list/StudentsLoadingGrid";
import { StudentsPagination } from "../components/list/StudentsPagination";

import {
  useDeleteStudent,
  useStudentSearch,
  useStudents,
  useToggleStudentAccount,
} from "../hooks/useStudents";

import type {
  EnrollmentStatus,
  StudentListFilters,
  StudentListItem,
} from "../types/student.types";

const defaultFilters: StudentListFilters = {
  page: 1,
  per_page: 12,
  sort: "asc",
};

const statusOptions: Array<{
  value: EnrollmentStatus;
  label: string;
}> = [
  {
    value: "enrolled",
    label: "Enrolled",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

export function StudentsPage() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] =
    useState("");

  const [filters, setFilters] =
    useState<StudentListFilters>(
      defaultFilters,
    );

  const [isExporting] =
    useState(false);

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

  const totalStudents =
    pagination?.total ??
    students.length;

  const hasFilters =
    Boolean(normalizedSearch) ||
    Boolean(filters.status) ||
    filters.sort === "desc";

  function changeSearch(
    value: string,
  ) {
    setSearchValue(value);

    setFilters((current) => ({
      ...current,
      page: 1,
    }));
  }

  function changeStatus(
    value: string,
  ) {
    setFilters((current) => ({
      ...current,
      page: 1,
      status: value
        ? (value as EnrollmentStatus)
        : undefined,
    }));
  }

  function toggleSortDirection() {
    setFilters((current) => ({
      ...current,
      page: 1,
      sort:
        current.sort === "asc"
          ? "desc"
          : "asc",
    }));
  }

  function resetFilters() {
    setSearchValue("");
    setFilters(defaultFilters);
  }

  function handleExport() {
    // سيتم ربط Export API هنا.
  }

  function openStudent(
    student: StudentListItem,
  ) {
    navigate(
      `/users/students/${student.enrollmentId}`,
    );
  }

  function editStudent(
    student: StudentListItem,
  ) {
    navigate(
      `/users/students/${student.enrollmentId}/edit`,
    );
  }

  async function deleteStudent(
    student: StudentListItem,
  ) {
    const confirmed =
      window.confirm(
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
      setPendingDeleteId(
        undefined,
      );
    }
  }

  async function toggleStudent(
    student: StudentListItem,
  ) {
    const normalizedStatus =
      String(
        student.accountStatus ??
          "",
      ).toLowerCase();

    const isEnabled =
      normalizedStatus ===
        "enabled" ||
      normalizedStatus ===
        "active";

    const nextAction =
      isEnabled
        ? "disable"
        : "enable";

    const confirmed =
      window.confirm(
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
      setPendingToggleId(
        undefined,
      );
    }
  }

  return (
    <section className="space-y-5">
      <header
        className={[
          "relative overflow-hidden rounded-[26px]",
          "border border-primary/20 bg-card",
          "px-5 py-5 sm:px-6",
          "shadow-[var(--shadow-card)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-primary opacity-[0.045]" />

        <div
          className={[
            "pointer-events-none absolute -right-10 -top-16",
            "h-40 w-40 rounded-full",
            "bg-primary opacity-15 blur-3xl",
          ].join(" ")}
        />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-0 pt-2">
            <button
              type="button"
              aria-label="Back to users"
              title="Back to users"
              onClick={() =>
                navigate("/users")
              }
              className={[
                "absolute left-2 top-0",
                "inline-flex h-7 w-7",
                "items-center justify-center",
                "rounded-full text-primary",
                "transition duration-200",
                "hover:-translate-x-0.5",
                "hover:bg-primary/[0.08]",
                "focus-visible:outline-none",
                "focus-visible:ring-4",
                "focus-visible:ring-primary/10",
              ].join(" ")}
            >
              <ArrowLeft
                className="h-4 w-4"
                strokeWidth={1.9}
              />
            </button>

            <div className="flex min-w-0 items-start gap-3.5">
              <span
                className={[
                  "mt-5 flex h-10 w-12 shrink-0",
                  "items-center justify-center",
                  "rounded-[17px]",
                  "bg-primary/[0.08]",
                  "text-primary",
                ].join(" ")}
              >
                <GraduationCap
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Student directory
                </p>

                <h1 className="mt-1 text-[27px] font-semibold tracking-[-0.04em] text-foreground">
                  Students
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm font-normal leading-6 text-muted-foreground">
                  Review profiles,
                  enrollment records and
                  academic information for
                  students.
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full gap-2.5 xl:w-[640px]">
            <div
              className={[
                "grid w-full gap-2",
                "sm:grid-cols-[minmax(0,1fr)_160px_82px_40px]",
              ].join(" ")}
            >
              <div className="relative min-w-0">
                <Search
                  className={[
                    "pointer-events-none absolute left-3.5 top-1/2",
                    "h-4 w-4 -translate-y-1/2",
                    normalizedSearch
                      ? "text-primary"
                      : "text-muted-foreground",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) =>
                    changeSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search students..."
                  className={[
                    "h-10 w-full rounded-xl",
                    "border border-primary/20",
                    "bg-card/80",
                    "pl-10 pr-10",
                    "text-xs font-medium",
                    "text-foreground",
                    "outline-none",
                    "transition-colors",
                    "placeholder:text-muted-foreground",
                    "focus:ring-2",
                    "focus:ring-primary/10",
                  ].join(" ")}
                />

                {activeQuery.isFetching ? (
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute right-3.5 top-1/2",
                      "h-4 w-4 -translate-y-1/2",
                      "animate-spin rounded-full",
                      "border-2 border-primary",
                      "border-t-transparent",
                    ].join(" ")}
                  />
                ) : null}
              </div>

              <label className="relative min-w-0">
                <span className="sr-only">
                  Enrollment status
                </span>

                <Filter
                  className={[
                    "pointer-events-none absolute left-3 top-1/2",
                    "h-4 w-4 -translate-y-1/2",
                    filters.status
                      ? "text-primary"
                      : "text-muted-foreground",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <select
                  value={
                    filters.status ??
                    ""
                  }
                  onChange={(event) =>
                    changeStatus(
                      event.target.value,
                    )
                  }
                  className={[
                    "h-10 w-full appearance-none",
                    "rounded-xl border",
                    "border-primary/20",
                    "bg-card/80",
                    "pl-9 pr-8",
                    "text-xs font-semibold",
                    filters.status
                      ? "text-primary"
                      : "text-muted-foreground",
                    "outline-none",
                    "transition-colors",
                    "hover:bg-primary/[0.05]",
                    "focus:ring-2",
                    "focus:ring-primary/10",
                  ].join(" ")}
                >
                  <option value="">
                    All statuses
                  </option>

                  {statusOptions.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <button
                type="button"
                onClick={
                  toggleSortDirection
                }
                title={
                  filters.sort ===
                  "asc"
                    ? "Sort Z to A"
                    : "Sort A to Z"
                }
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-card/80 px-3",
                  "text-xs font-semibold",
                  "text-primary",
                  "transition-colors",
                  "hover:bg-primary/[0.07]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                ].join(" ")}
              >
                <ArrowUpAZ
                  className={[
                    "h-4 w-4",
                    "transition-transform",
                    filters.sort ===
                    "desc"
                      ? "rotate-180"
                      : "",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <span>
                  {filters.sort ===
                  "asc"
                    ? "A–Z"
                    : "Z–A"}
                </span>
              </button>

              <button
                type="button"
                aria-label="Reset student filters"
                title="Reset filters"
                disabled={!hasFilters}
                onClick={resetFilters}
                className={[
                  "inline-flex h-10 w-10",
                  "items-center justify-center",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-card/80",
                  "text-primary",
                  "transition-colors",
                  "hover:bg-primary/[0.07]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                  "disabled:cursor-not-allowed",
                  "disabled:text-muted-foreground",
                  "disabled:opacity-35",
                ].join(" ")}
              >
                <RotateCcw
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                disabled={isExporting}
                onClick={handleExport}
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-card/80 px-3",
                  "text-xs font-semibold",
                  "text-primary",
                  "transition-colors",
                  "hover:bg-primary/[0.07]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-50",
                ].join(" ")}
              >
                <Download
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                <span>
                  {isExporting
                    ? "Exporting..."
                    : "Export"}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/users/students/import",
                  )
                }
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl border",
                  "border-primary/20",
                  "bg-card/80 px-3",
                  "text-xs font-semibold",
                  "text-primary",
                  "transition-colors",
                  "hover:bg-primary/[0.07]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                ].join(" ")}
              >
                <Upload
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                <span>
                  Import
                </span>
              </button>

              <button
                type="button"
                disabled={
                  activeQuery.isFetching
                }
                onClick={() => {
                  void activeQuery.refetch();
                }}
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl bg-primary px-3",
                  "text-xs font-semibold",
                  "text-primary-foreground",
                  "shadow-[var(--shadow-auth-button)]",
                  "transition-transform",
                  "hover:-translate-y-0.5",
                  "hover:bg-primary/90",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                  "disabled:cursor-not-allowed",
                  "disabled:opacity-60",
                ].join(" ")}
              >
                <RefreshCcw
                  className={[
                    "h-4 w-4",
                    activeQuery.isFetching
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                  strokeWidth={1.8}
                />

                <span>
                  Refresh
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/users/students/new",
                  )
                }
                className={[
                  "inline-flex h-10",
                  "items-center justify-center gap-2",
                  "rounded-xl bg-primary px-3",
                  "text-xs font-semibold",
                  "text-primary-foreground",
                  "shadow-[var(--shadow-auth-button)]",
                  "transition-transform",
                  "hover:-translate-y-0.5",
                  "hover:bg-primary/90",
                  "focus-visible:outline-none",
                  "focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                ].join(" ")}
              >
                <Plus
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                <span>
                  Add
                </span>
              </button>
            </div>

            {normalizedSearch.length ===
            1 ? (
              <p className="px-1 text-[11px] font-medium text-warning">
                Enter at least two
                characters to search.
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {!activeQuery.isPending &&
      !activeQuery.isError ? (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex items-center gap-2",
              "rounded-full border",
              "border-primary/20",
              "bg-primary/[0.07]",
              "px-3 py-1.5",
              "text-xs font-medium",
              "text-primary",
            ].join(" ")}
          >
            <GraduationCap className="h-3.5 w-3.5" />

            {totalStudents}{" "}
            {totalStudents === 1
              ? "student"
              : "students"}
          </span>

          <span
            className={[
              "inline-flex items-center gap-2",
              "rounded-full border",
              "border-primary/20",
              "bg-primary/[0.07]",
              "px-3 py-1.5",
              "text-xs font-medium",
              "text-primary",
            ].join(" ")}
          >
            <Sparkles className="h-3.5 w-3.5" />

            Updated directory
          </span>

          {filters.status ? (
            <span
              className={[
                "inline-flex items-center",
                "rounded-full border",
                "border-primary/20",
                "bg-primary/[0.07]",
                "px-3 py-1.5",
                "text-xs font-medium",
                "capitalize text-primary",
              ].join(" ")}
            >
              {filters.status}
            </span>
          ) : null}

          {isSearchMode ? (
            <span
              className={[
                "inline-flex max-w-56",
                "items-center truncate",
                "rounded-full border",
                "border-border/60",
                "bg-muted/50",
                "px-3 py-1.5",
                "text-xs font-medium",
                "text-muted-foreground",
              ].join(" ")}
            >
              Search:{" "}
              {normalizedSearch}
            </span>
          ) : null}
        </div>
      ) : null}

      {activeQuery.isPending ? (
        <StudentsLoadingGrid />
      ) : activeQuery.isError ? (
        <StudentsErrorState
          onRetry={() =>
            void activeQuery.refetch()
          }
        />
      ) : students.length ===
        0 ? (
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
          className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
        >
          {students.map(
            (
              student,
              index,
            ) => (
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
                onView={
                  openStudent
                }
                onEdit={
                  editStudent
                }
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
          total={
            pagination.total
          }
          from={
            pagination.from
          }
          to={pagination.to}
          disabled={
            activeQuery.isFetching
          }
          onPageChange={(
            page,
          ) => {
            setFilters(
              (current) => ({
                ...current,
                page,
              }),
            );

            window.scrollTo({
              top: 0,
              behavior:
                "smooth",
            });
          }}
        />
      ) : null}
    </section>
  );
}

function StudentsErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <section className="rounded-[26px] border border-destructive/20 bg-card px-6 py-14 text-center shadow-[var(--shadow-card)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-destructive/[0.08] text-destructive">
        <GraduationCap className="h-6 w-6" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Students could not be
        loaded
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Check your connection
        and permissions, then
        try loading the student
        directory again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className={[
          "mt-5 inline-flex h-10",
          "items-center gap-2",
          "rounded-xl",
          "border border-border",
          "bg-card px-4",
          "text-xs font-semibold",
          "text-foreground",
          "transition-colors",
          "hover:bg-muted",
        ].join(" ")}
      >
        <RefreshCcw className="h-4 w-4" />

        Try again
      </button>
    </section>
  );
}