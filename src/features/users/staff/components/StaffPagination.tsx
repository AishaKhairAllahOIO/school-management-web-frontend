import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type StaffPaginationProps = {
  currentPage: number;
  lastPage: number;

  total: number;
  from: number | null;
  to: number | null;

  itemLabel: string;

  disabled?: boolean;

  onPageChange: (
    page: number,
  ) => void;
};

function createPages(
  currentPage: number,
  lastPage: number,
): number[] {
  if (lastPage <= 5) {
    return Array.from(
      {
        length: lastPage,
      },
      (
        _,
        index,
      ) => index + 1,
    );
  }

  const start =
    Math.max(
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
    (
      _,
      index,
    ) => start + index,
  );
}

export function StaffPagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  itemLabel,
  disabled = false,
  onPageChange,
}: StaffPaginationProps) {
  if (total === 0) {
    return null;
  }

  const pages =
    createPages(
      currentPage,
      lastPage,
    );

  const buttonClassName =
    "flex h-11 min-w-11 items-center justify-center rounded-2xl text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-muted-foreground">
        Showing {from ?? 0} to{" "}
        {to ?? 0} of {total}{" "}
        {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={
            disabled ||
            currentPage <= 1
          }
          onClick={() =>
            onPageChange(
              currentPage - 1,
            )
          }
          className={`${buttonClassName} border border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-secondary hover:text-foreground`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map(
          (page) => (
            <button
              key={page}
              type="button"
              disabled={disabled}
              onClick={() =>
                onPageChange(
                  page,
                )
              }
              aria-current={
                page ===
                currentPage
                  ? "page"
                  : undefined
              }
              className={`${buttonClassName} ${
                page ===
                currentPage
                  ? "primary-gradient text-primary-foreground shadow-[var(--shadow-auth-button)]"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-secondary hover:text-foreground"
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={
            disabled ||
            currentPage >=
              lastPage
          }
          onClick={() =>
            onPageChange(
              currentPage + 1,
            )
          }
          className={`${buttonClassName} border border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-secondary hover:text-foreground`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}