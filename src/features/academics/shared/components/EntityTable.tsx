import type { CSSProperties, ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  emptyText: string;
  actions?: (row: T) => ReactNode;
};

function createGridTemplate(columnCount: number, hasActions: boolean): string {
  const dataColumns = Array.from({ length: columnCount }, (_, index) =>
    index === 0 ? "minmax(230px, 1.5fr)" : "minmax(150px, 1fr)",
  );

  if (hasActions) {
    dataColumns.push("minmax(132px, 0.68fr)");
  }

  return dataColumns.join(" ");
}

export function EntityTable<T>({
  columns,
  rows,
  getRowId,
  emptyText,
  actions,
}: Props<T>) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: createGridTemplate(columns.length, Boolean(actions)),
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="hidden items-center gap-4 px-5 pb-1.5 md:grid"
        style={gridStyle}
      >
        {columns.map((column) => (
          <span
            key={column.key}
            className={[
              "text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70",
              column.className,
            ].join(" ")}
          >
            {column.header}
          </span>
        ))}

        {actions ? (
          <span className="text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
            Actions
          </span>
        ) : null}
      </div>

      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <article
            key={getRowId(row)}
            className={[
              "group relative overflow-hidden rounded-[22px] border bg-card",
              "border-border/65 shadow-[var(--shadow-card)]",
              "transition-[transform,border-color,box-shadow] duration-300",
              "hover:-translate-y-0.5 hover:border-[var(--academic-border)]",
              "hover:shadow-[var(--shadow-floating)]",
              "motion-reduce:transform-none motion-reduce:transition-none",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-[var(--academic-accent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />

            <div
              className="grid gap-4 px-5 py-4 md:items-center"
              style={gridStyle}
            >
              {columns.map((column, columnIndex) => (
                <div
                  key={column.key}
                  className={[
                    "min-w-0",
                    columnIndex === 0 ? "md:pr-4" : "",
                    column.className,
                  ].join(" ")}
                >
                  <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.11em] text-muted-foreground/65 md:hidden">
                    {column.header}
                  </span>

                  <div
                    className={[
                      "text-sm",
                      columnIndex === 0
                        ? "font-semibold text-foreground"
                        : "font-normal text-foreground/80",
                    ].join(" ")}
                  >
                    {column.render(row)}
                  </div>
                </div>
              ))}

              {actions ? (
                <div className="flex items-center justify-end border-t border-border/50 pt-3 md:border-0 md:pt-0">
                  {actions(row)}
                </div>
              ) : null}
            </div>

            <span className="sr-only">Row {rowIndex + 1}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
