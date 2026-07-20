import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type StudentsPaginationProps = {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

function createPages(
  currentPage: number,
  lastPage: number,
) {
  if (lastPage <= 5) {
    return Array.from(
      {
        length: lastPage,
      },
      (_, index) => index + 1,
    );
  }

  const start = Math.max(
    1,
    Math.min(
      currentPage - 2,
      lastPage - 4,
    ),
  );

  return Array.from(
    {
      length: 5,
    },
    (_, index) => start + index,
  );
}

export function StudentsPagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  disabled = false,
  onPageChange,
}: StudentsPaginationProps) {
  if (total === 0) {
    return null;
  }

  const pages = createPages(
    currentPage,
    lastPage,
  );

  return (
    <div className="flex flex-col gap-4 rounded-[26px] border border-white bg-white px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        عرض{" "}
        <strong className="text-slate-900">
          {from ?? 0}
        </strong>{" "}
        إلى{" "}
        <strong className="text-slate-900">
          {to ?? 0}
        </strong>{" "}
        من أصل{" "}
        <strong className="text-slate-900">
          {total}
        </strong>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={
            disabled || currentPage <= 1
          }
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            disabled={disabled}
            onClick={() => onPageChange(page)}
            className={[
              "flex h-10 min-w-10 items-center justify-center rounded-2xl px-3 text-sm font-bold transition",
              page === currentPage
                ? "bg-slate-950 text-white shadow-lg shadow-slate-300"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={
            disabled ||
            currentPage >= lastPage
          }
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}