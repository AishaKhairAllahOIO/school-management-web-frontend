import {
  Filter,
  RotateCcw,
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

export function StudentsFiltersBar({
  searchValue,
  filters,
  onFiltersChange,
  onReset,
}: StudentsFiltersBarProps) {
  const hasFilters =
    Boolean(searchValue.trim()) ||
    Boolean(filters.status) ||
    filters.sort === "desc";

  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_42px] gap-2">
      <label className="relative min-w-0">
        <span className="sr-only">
          Enrollment status
        </span>

        <Filter
          className={[
            "pointer-events-none absolute left-3.5 top-1/2",
            "h-4 w-4 -translate-y-1/2",
            filters.status
              ? "text-primary"
              : "text-muted-foreground",
          ].join(" ")}
          strokeWidth={1.8}
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
            "h-10 w-full appearance-none rounded-xl",
            "border border-primary/20",
            "bg-card/80",
            "pl-10 pr-9",
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
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ),
          )}
        </select>

        <span
          aria-hidden="true"
          className={[
            "pointer-events-none absolute right-3.5 top-1/2",
            "h-0 w-0 -translate-y-1/2",
            "border-x-[4px] border-t-[5px]",
            "border-x-transparent",
            filters.status
              ? "border-t-primary"
              : "border-t-muted-foreground",
          ].join(" ")}
        />
      </label>

      <button
        type="button"
        aria-label="Reset student filters"
        title="Reset filters"
        disabled={!hasFilters}
        onClick={onReset}
        className={[
          "inline-flex h-10 w-[42px]",
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
          "disabled:opacity-40",
        ].join(" ")}
      >
        <RotateCcw
          className="h-4 w-4"
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}