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
  onFiltersChange: (
    filters: StudentListFilters,
  ) => void;
  onReset: () => void;
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

const controlClassName = [
  "h-11 rounded-xl",
  "border border-border/70",
  "bg-background",
  "text-sm font-normal",
  "text-foreground outline-none",
  "transition-all duration-200",
  "hover:border-primary/25",
  "focus:border-primary/45",
  "focus:ring-4",
  "focus:ring-primary/10",
].join(" ");

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
    <section
      className={[
        "sticky top-4 z-20",
        "rounded-[20px]",
        "border border-border/60",
        "bg-card/95 p-3",
        "shadow-[0_12px_35px_rgba(30,20,70,0.06)]",
        "backdrop-blur-md",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={searchValue}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search by student name..."
            className={[
              controlClassName,
              "w-full pl-10 pr-11",
              "placeholder:text-muted-foreground/70",
            ].join(" ")}
          />

          {isFetching ? (
            <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(170px,1fr)_minmax(170px,1fr)_auto]">
          <label className="relative">
            <span className="sr-only">
              Enrollment status
            </span>

            <Filter
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <select
              value={filters.status ?? ""}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  page: 1,
                  status: event.target.value
                    ? (event.target
                        .value as EnrollmentStatus)
                    : undefined,
                })
              }
              className={[
                controlClassName,
                "w-full appearance-none pl-10 pr-9",
              ].join(" ")}
            >
              <option value="">
                All statuses
              </option>

              {statusOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="relative">
            <span className="sr-only">
              Sort students
            </span>

            <ArrowDownAZ
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <select
              value={filters.sort ?? "asc"}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  page: 1,
                  sort: event.target
                    .value as
                    | "asc"
                    | "desc",
                })
              }
              className={[
                controlClassName,
                "w-full appearance-none pl-10 pr-9",
              ].join(" ")}
            >
              <option value="asc">
                Name: A–Z
              </option>

              <option value="desc">
                Name: Z–A
              </option>
            </select>
          </label>

          <button
            type="button"
            disabled={!hasFilters}
            onClick={onReset}
            className={[
              "inline-flex h-11 items-center",
              "justify-center gap-2 rounded-xl",
              "border border-border/70",
              "bg-card px-4",
              "text-sm font-medium",
              "text-muted-foreground",
              "transition-all",
              "hover:border-primary/20",
              "hover:bg-primary/[0.045]",
              "hover:text-primary",
              "disabled:cursor-not-allowed",
              "disabled:opacity-40",
            ].join(" ")}
          >
            <RotateCcw
              size={15}
              strokeWidth={1.75}
            />

            <span className="sm:hidden xl:inline">
              Reset
            </span>
          </button>
        </div>
      </div>

      {searchValue.trim().length === 1 ? (
        <p className="px-2 pt-2 text-[11px] font-normal text-amber-600">
          Enter at least two characters to
          search.
        </p>
      ) : null}
    </section>
  );
}