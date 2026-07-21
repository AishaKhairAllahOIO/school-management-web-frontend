import {
  ArrowDownAZ,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";

import type {
  EnrollmentStatus,
  StudentListFilters,
} from "../../types/student.types";

type StudentsFiltersBarProps = {
  searchValue: string;
  filters: StudentListFilters;
  isFetching?: boolean;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: StudentListFilters) => void;
  onReset: () => void;
};

const statusOptions: Array<{
  value: EnrollmentStatus;
  label: string;
}> = [
  { value: "enrolled", label: "Enrolled" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "completed", label: "Completed" },
];

const controlClassName =
  "h-12 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground outline-none transition hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10";

export function StudentsFiltersBar({
  searchValue,
  filters,
  isFetching = false,
  onSearchChange,
  onFiltersChange,
  onReset,
}: StudentsFiltersBarProps) {
  const hasFilters =
    Boolean(searchValue.trim()) ||
    Boolean(filters.status) ||
    filters.sort === "desc";

  return (
    <section className="glass-card sticky top-4 z-20 rounded-[28px] p-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search students by name..."
            className={[
              controlClassName,
              "w-full bg-muted/75 pl-12 pr-12 font-medium placeholder:text-muted-foreground/70 focus:bg-card",
            ].join(" ")}
          />

          {isFetching ? (
            <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(170px,1fr)_minmax(170px,1fr)_auto]">
          <label className="relative">
            <span className="sr-only">Enrollment status</span>
            <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <select
              value={filters.status ?? ""}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  page: 1,
                  status: event.target.value
                    ? (event.target.value as EnrollmentStatus)
                    : undefined,
                })
              }
              className={[
                controlClassName,
                "w-full min-w-0 appearance-none pl-10 pr-9",
              ].join(" ")}
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="relative">
            <span className="sr-only">Sort students</span>
            <ArrowDownAZ className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <select
              value={filters.sort ?? "asc"}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  page: 1,
                  sort: event.target.value as "asc" | "desc",
                })
              }
              className={[
                controlClassName,
                "w-full min-w-0 appearance-none pl-10 pr-9",
              ].join(" ")}
            >
              <option value="asc">Name: A–Z</option>
              <option value="desc">Name: Z–A</option>
            </select>
          </label>

          <button
            type="button"
            disabled={!hasFilters}
            onClick={onReset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-muted-foreground transition hover:border-primary/25 hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sm:hidden xl:inline">Reset</span>
          </button>
        </div>
      </div>

      {searchValue.trim().length === 1 ? (
        <p className="px-3 pt-2 text-xs font-semibold text-warning">
          Enter at least two characters to start searching.
        </p>
      ) : null}
    </section>
  );
}
