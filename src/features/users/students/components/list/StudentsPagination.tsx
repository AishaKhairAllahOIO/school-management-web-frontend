import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

type StudentsPaginationProps = {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  disabled?: boolean;
  onPageChange: (
    page: number,
  ) => void;
};

type PaginationItem =
  | number
  | "left-ellipsis"
  | "right-ellipsis";

function clampPage(
  page: number,
  lastPage: number,
): number {
  return Math.min(
    Math.max(page, 1),
    Math.max(lastPage, 1),
  );
}

function createPaginationItems(
  currentPage: number,
  lastPage: number,
): PaginationItem[] {
  if (lastPage <= 7) {
    return Array.from(
      {
        length: lastPage,
      },
      (_, index) =>
        index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "right-ellipsis",
      lastPage,
    ];
  }

  if (
    currentPage >=
    lastPage - 3
  ) {
    return [
      1,
      "left-ellipsis",
      lastPage - 4,
      lastPage - 3,
      lastPage - 2,
      lastPage - 1,
      lastPage,
    ];
  }

  return [
    1,
    "left-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "right-ellipsis",
    lastPage,
  ];
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
  if (total <= 0) {
    return null;
  }

  const safeLastPage =
    Math.max(lastPage, 1);

  const safeCurrentPage =
    clampPage(
      currentPage,
      safeLastPage,
    );

  const items =
    createPaginationItems(
      safeCurrentPage,
      safeLastPage,
    );

  const hasPreviousPage =
    safeCurrentPage > 1;

  const hasNextPage =
    safeCurrentPage <
    safeLastPage;

  const buttonClassName = [
    "flex h-10 min-w-10 items-center justify-center",
    "rounded-xl px-3",
    "text-xs font-semibold",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "focus-visible:ring-primary/10",
    "disabled:cursor-not-allowed",
    "disabled:opacity-35",
  ].join(" ");

  function changePage(
    requestedPage: number,
  ) {
    if (disabled) {
      return;
    }

    const nextPage =
      clampPage(
        requestedPage,
        safeLastPage,
      );

    if (
      nextPage ===
      safeCurrentPage
    ) {
      return;
    }

    onPageChange(nextPage);
  }

  return (
    <nav
      aria-label="Students pagination"
      className={[
        "flex flex-col gap-4",
        "rounded-[22px]",
        "border border-border/70",
        "bg-card/80",
        "px-4 py-3.5",
        "shadow-[var(--shadow-card)]",
        "backdrop-blur",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between",
      ].join(" ")}
    >
      <p className="text-center text-[13px] font-normal text-muted-foreground sm:text-left">
        Showing{" "}
        <strong className="font-semibold text-foreground">
          {from ?? 0}
        </strong>{" "}
        to{" "}
        <strong className="font-semibold text-foreground">
          {to ?? 0}
        </strong>{" "}
        of{" "}
        <strong className="font-semibold text-foreground">
          {total}
        </strong>{" "}
        students
      </p>

      {safeLastPage > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            disabled={
              disabled ||
              !hasPreviousPage
            }
            onClick={() =>
              changePage(
                safeCurrentPage - 1,
              )
            }
            className={[
              buttonClassName,
              "border border-border",
              "bg-card",
              "text-muted-foreground",
              "hover:border-primary/20",
              "hover:bg-primary/[0.06]",
              "hover:text-primary",
            ].join(" ")}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {items.map((item) => {
            if (
              item ===
                "left-ellipsis" ||
              item ===
                "right-ellipsis"
            ) {
              return (
                <span
                  key={item}
                  aria-hidden="true"
                  className="flex h-10 min-w-8 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isCurrent =
              item ===
              safeCurrentPage;

            return (
              <button
                key={item}
                type="button"
                disabled={disabled}
                onClick={() =>
                  changePage(item)
                }
                aria-label={`Page ${item}`}
                aria-current={
                  isCurrent
                    ? "page"
                    : undefined
                }
                className={[
                  buttonClassName,
                  isCurrent
                    ? [
                        "primary-gradient",
                        "text-primary-foreground",
                        "shadow-[var(--shadow-auth-button)]",
                      ].join(" ")
                    : [
                        "border border-border",
                        "bg-card",
                        "text-muted-foreground",
                        "hover:border-primary/20",
                        "hover:bg-primary/[0.06]",
                        "hover:text-primary",
                      ].join(" "),
                ].join(" ")}
              >
                {item}
              </button>
            );
          })}

          <button
            type="button"
            disabled={
              disabled ||
              !hasNextPage
            }
            onClick={() =>
              changePage(
                safeCurrentPage + 1,
              )
            }
            className={[
              buttonClassName,
              "border border-border",
              "bg-card",
              "text-muted-foreground",
              "hover:border-primary/20",
              "hover:bg-primary/[0.06]",
              "hover:text-primary",
            ].join(" ")}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </nav>
  );
}