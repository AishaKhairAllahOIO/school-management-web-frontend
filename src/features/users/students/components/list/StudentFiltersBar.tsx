import {
  Filter,
  RotateCcw,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";


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
  { value: "enrolled", label: "Enrolled" },
  { value: "suspended", label: "Suspended" },
  { value: "completed", label: "Completed" },
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
      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            page: 1,
            status:
              value === "all"
                ? undefined
                : (value as EnrollmentStatus),
          })
        }
      >
        <SelectTrigger className="h-10 rounded-xl border-primary/20 bg-card/80 px-3 text-xs font-medium">
          <div className="flex min-w-0 items-center gap-2">
            <Filter className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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