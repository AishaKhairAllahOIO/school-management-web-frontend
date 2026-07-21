import { ChevronLeft, ChevronRight } from "lucide-react";

type StudentsPaginationProps = {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

function createPages(currentPage: number, lastPage: number) {
  if (lastPage <= 5) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, lastPage - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
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
  if (total === 0) return null;

  const pages = createPages(currentPage, lastPage);
  const buttonBase =
    "flex h-11 min-w-11 items-center justify-center rounded-2xl text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <nav
      aria-label="Students pagination"
      className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/80 p-4 shadow-[var(--shadow-card)] backdrop-blur sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-center text-sm font-semibold text-muted-foreground sm:text-left">
        Showing <strong className="text-foreground">{from ?? 0}</strong> to{" "}
        <strong className="text-foreground">{to ?? 0}</strong> of{" "}
        <strong className="text-foreground">{total}</strong> students
      </p>

      <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`${buttonBase} border border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-secondary hover:text-foreground`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            disabled={disabled}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${buttonBase} ${
              page === currentPage
                ? "primary-gradient text-primary-foreground shadow-[var(--shadow-auth-button)]"
                : "border border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-secondary hover:text-foreground"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={disabled || currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className={`${buttonBase} border border-border bg-card text-muted-foreground hover:border-primary/25 hover:bg-secondary hover:text-foreground`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
