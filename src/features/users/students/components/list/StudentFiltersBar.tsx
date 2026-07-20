import {
  ArrowDownAZ,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
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
    label: "مسجل",
  },
  {
    value: "pending",
    label: "قيد الانتظار",
  },
  {
    value: "suspended",
    label: "موقوف",
  },
  {
    value: "withdrawn",
    label: "منسحب",
  },
  {
    value: "completed",
    label: "مكتمل",
  },
];

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
    <section className="sticky top-4 z-20 rounded-[26px] border border-white/80 bg-white/90 p-3 shadow-[0_14px_50px_rgba(15,23,42,0.09)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            value={searchValue}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="ابحثي عن طالب بالاسم..."
            className="h-12 w-full rounded-[18px] border border-transparent bg-slate-100 pr-12 pl-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-200 focus:bg-white focus:ring-4 focus:ring-rose-100"
          />

          {isFetching ? (
            <span className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

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
              className="h-11 min-w-40 appearance-none rounded-2xl border border-slate-200 bg-white pr-10 pl-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
            >
              <option value="">
                جميع الحالات
              </option>

              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <ArrowDownAZ className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
              value={filters.sort ?? "asc"}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  page: 1,
                  sort: event.target
                    .value as "asc" | "desc",
                })
              }
              className="h-11 min-w-40 appearance-none rounded-2xl border border-slate-200 bg-white pr-10 pl-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
            >
              <option value="asc">
                أ-ي
              </option>

              <option value="desc">
                ي-أ
              </option>
            </select>
          </div>

          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            فلاتر
          </button>

          <button
            type="button"
            disabled={!hasFilters}
            onClick={onReset}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="إعادة تعيين"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {searchValue.trim().length === 1 ? (
        <p className="px-3 pt-2 text-xs font-medium text-amber-600">
          اكتبي حرفين على الأقل لبدء البحث.
        </p>
      ) : null}
    </section>
  );
}