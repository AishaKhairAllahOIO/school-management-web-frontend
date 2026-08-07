import {
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

import { useAcademicTheme } from "../hooks/useAcademicTheme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type BaseEntity = {
  id: string;
};

type FormValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[];

export type FormValues = Record<
  string,
  FormValue
>;

type FieldType =
  | "text"
  | "number"
  | "checkbox"
  | "select"
  | "array";

// ✅ التغيير الجوهري: إزالة الـ Generic من CrudField
export type CrudField = {
  name: string;  // ✅ أصبح string بدلاً من keyof TCreate
  label: string;
  type: FieldType;
  options?:
    | Array<{
        label: string;
        value: string;
      }>
    | ((values: FormValues, isEdit: boolean) => Array<{
        label: string;
        value: string;
      }>);
  defaultValue: FormValue;
  required?: boolean;
  full?: boolean;
  min?: number;
  max?: number;
  disabledOnEdit?: boolean;
  helperText?: string;
  disabled?: boolean | ((values: FormValues, isEdit: boolean) => boolean);
  resetFieldsOnChange?: string[];
};

export type CrudColumn<
  TEntity extends BaseEntity,
> = {
  key: string;
  header: string;
  render: (row: TEntity) => ReactNode;
  searchableText?: (row: TEntity) => string;
  align?: "left" | "center" | "right";
};

type MutationOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

type MutationState<TPayload> = {
  mutate: (
    payload: TPayload,
    options?: MutationOptions,
  ) => void;
  isPending?: boolean;
};

type CrudPageProps<
  TEntity extends BaseEntity,
  TCreate extends object,
  TUpdate extends object,
> = {
  title: string;
  description: string;
  addLabel: string;

  rows: TEntity[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;

  fields: Array<CrudField>;  // ✅ أصبح بدون Generic
  columns: Array<CrudColumn<TEntity>>;

  createMutation: MutationState<TCreate>;
  updateMutation: MutationState<{
    id: string;
    payload: TUpdate;
  }>;
  deleteMutation: MutationState<string>;

  loadEntity?: (id: string) => Promise<TEntity>;

  toFormValues: (
    row: TEntity,
  ) => FormValues | TEntity;

  buildPayload: (
    values: FormValues,
  ) => TCreate;

  buildUpdatePayload: (
    values: FormValues,
    currentRow: TEntity,
  ) => TUpdate;

  emptyTitle?: string;
  emptyDescription?: string;
  deleteTitle?: string;
  deleteDescription?: (
    row: TEntity,
  ) => string;

  searchPlaceholder?: string;
  enableSearch?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
};

function BackToAcademicsOverview() {
  return (
    <Link
      to="/academics"
      className="group inline-flex w-fit items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-[var(--academic-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--academic-ring)] focus-visible:ring-offset-2"
    >
      <ArrowLeft
        size={16}
        strokeWidth={2}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      Back to Academics Overview
    </Link>
  );
}

export function CrudPage<
  TEntity extends BaseEntity,
  TCreate extends object,
  TUpdate extends object,
>({
  title,
  description,
  addLabel,
  rows,
  isLoading = false,
  isError = false,
  onRetry,
  fields,
  columns,
  createMutation,
  updateMutation,
  deleteMutation,
  loadEntity,
  toFormValues,
  buildPayload,
  buildUpdatePayload,
  emptyTitle = "No records found",
  emptyDescription = "Create the first record to get started.",
  deleteTitle = "Delete record?",
  deleteDescription = () =>
    "This record will be permanently deleted.",
  pageSize = 6,
}: CrudPageProps<TEntity, TCreate, TUpdate>) {
  const academicTheme = useAcademicTheme();
  const SectionIcon = academicTheme.icon;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize] = useState(pageSize);

  const totalPages = Math.max(1, Math.ceil(rows.length / currentPageSize));

  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    return rows.slice(start, start + currentPageSize);
  }, [rows, currentPage, currentPageSize]);

  const firstVisibleRecord = rows.length === 0
    ? 0
    : (currentPage - 1) * currentPageSize + 1;
  const lastVisibleRecord = Math.min(
    currentPage * currentPageSize,
    rows.length,
  );

  const [dialogRow, setDialogRow] =
    useState<TEntity | "new" | null>(
      null,
    );

  const [viewingRow, setViewingRow] =
    useState<TEntity | null>(null);

  const [values, setValues] =
    useState<FormValues>({});

  const [formErrors, setFormErrors] =
    useState<Record<string, string>>(
      {},
    );

  const [deletingRow, setDeletingRow] =
    useState<TEntity | null>(null);

  const [
    isLoadingDetails,
    setIsLoadingDetails,
  ] = useState(false);

  const [
    detailsError,
    setDetailsError,
  ] = useState<string | null>(null);

  function openCreate() {
    const initialValues: FormValues = {};

    for (const field of fields) {
      initialValues[field.name] =
        field.defaultValue;
    }

    setValues(initialValues);
    setFormErrors({});
    setDetailsError(null);
    setDialogRow("new");
  }

  async function fetchLatestRow(
    row: TEntity,
  ): Promise<TEntity> {
    if (!loadEntity) {
      return row;
    }

    setIsLoadingDetails(true);
    setDetailsError(null);

    try {
      return await loadEntity(row.id);
    } catch {
      setDetailsError(
        "The latest record details could not be loaded.",
      );
      throw new Error(
        "Failed to load record details.",
      );
    } finally {
      setIsLoadingDetails(false);
    }
  }

  async function openView(
    row: TEntity,
  ) {
    setDetailsError(null);
    setViewingRow(row);

    try {
      const latest =
        await fetchLatestRow(row);

      setViewingRow(latest);
    } catch {
      // The drawer remains open and shows
      // the error state.
    }
  }

  async function openEdit(
    row: TEntity,
  ) {
    setFormErrors({});
    setDetailsError(null);
    setDialogRow(row);
    setValues(
      toFormValues(row) as FormValues,
    );

    try {
      const latest =
        await fetchLatestRow(row);

      setDialogRow(latest);
      setValues(
        toFormValues(
          latest,
        ) as FormValues,
      );
    } catch {
      // The dialog remains open and
      // displays the details error.
    }
  }

  function closeDialog() {
    if (
      createMutation.isPending ||
      updateMutation.isPending ||
      isLoadingDetails
    ) {
      return;
    }

    setDialogRow(null);
    setValues({});
    setFormErrors({});
    setDetailsError(null);
  }

  function validate(): boolean {
    const nextErrors: Record<
      string,
      string
    > = {};

    for (const field of fields) {
      const value =
        values[field.name];

      if (
        field.required &&
        (value === "" ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) &&
            value.length === 0))
      ) {
        nextErrors[field.name] =
          `${field.label} is required.`;
        continue;
      }

      if (
        field.type === "number" &&
        value !== "" &&
        value !== null
      ) {
        const numberValue =
          Number(value);

        if (
          !Number.isFinite(numberValue)
        ) {
          nextErrors[field.name] =
            `Enter a valid ${field.label.toLowerCase()}.`;
        } else if (
          field.min !== undefined &&
          numberValue < field.min
        ) {
          nextErrors[field.name] =
            `${field.label} must be at least ${field.min}.`;
        } else if (
          field.max !== undefined &&
          numberValue > field.max
        ) {
          nextErrors[field.name] =
            `${field.label} must not exceed ${field.max}.`;
        }
      }
    }

    setFormErrors(nextErrors);

    return (
      Object.keys(nextErrors).length ===
      0
    );
  }

  function submit() {
    if (!validate()) {
      return;
    }

    if (dialogRow === "new") {
      createMutation.mutate(
        buildPayload(values),
        {
          onSuccess: closeDialog,
        },
      );
      return;
    }

    if (!dialogRow) {
      return;
    }

    const updatePayload =
      buildUpdatePayload(
        values,
        dialogRow,
      );

    if (
      Object.keys(updatePayload).length ===
      0
    ) {
      closeDialog();
      return;
    }

    updateMutation.mutate(
      {
        id: dialogRow.id,
        payload: updatePayload,
      },
      {
        onSuccess: closeDialog,
      },
    );
  }

  function confirmDelete() {
    if (!deletingRow) {
      return;
    }

    deleteMutation.mutate(
      deletingRow.id,
      {
        onSuccess: () =>
          setDeletingRow(null),
      },
    );
  }

  const isSubmitting =
    Boolean(createMutation.isPending) ||
    Boolean(updateMutation.isPending);

  if (isError) {
    return (
      <div className="space-y-4" style={academicTheme.style}>
        <BackToAcademicsOverview />
        <div className="rounded-3xl border border-destructive/20 bg-card p-8 text-center shadow-soft">
          <AlertTriangle
            size={28}
            className="mx-auto text-destructive"
          />
          <h1 className="mt-4 text-xl font-medium text-foreground">
            Failed to load{" "}
            {title.toLowerCase()}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The data could not be retrieved
            from the server.
          </p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--academic-accent)] px-5 text-xs font-semibold text-white"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" style={academicTheme.style}>
      <BackToAcademicsOverview />

      <section className="overflow-hidden rounded-[22px] border border-border/70 bg-card shadow-[0_12px_34px_rgba(31,24,74,0.055)]">
        <header className="relative overflow-hidden px-6 py-5 sm:px-7">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--academic-accent)]" />
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--academic-soft)] blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)]">
                <SectionIcon size={25} strokeWidth={1.75} />
              </span>

              <div className="min-w-0">
                <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-foreground">
                  {title}
                </h1>
                <p className="mt-1 text-sm font-normal text-[var(--academic-accent)]">
                  Academic {academicTheme.label}
                </p>
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--academic-accent)] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_var(--academic-shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--academic-accent)]/92 sm:w-auto"
            >
              <Plus size={17} />
              {addLabel}
            </button>
          </div>
        </header>
      </section>

      <section className="overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-[0_10px_30px_rgba(31,24,74,0.045)]">
        {isLoading ? (
          <TableSkeleton columns={columns.length} rows={currentPageSize} />
        ) : rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--academic-border)] bg-[var(--academic-soft)] text-[var(--academic-accent)]">
              <SectionIcon size={24} strokeWidth={1.7} />
            </span>
            <h2 className="mt-4 text-base font-medium text-foreground">{emptyTitle}</h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">{emptyDescription}</p>
            <button type="button" onClick={openCreate} className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--academic-accent)] px-5 text-xs font-semibold text-white">
              <Plus size={15} />
              {addLabel}
            </button>
          </div>
        ) : (
          <>
            <div className="px-4 py-4 sm:px-5">
              <div
                className="hidden items-center gap-4 px-5 pb-2 lg:grid"
                style={{
                  gridTemplateColumns: [
                    ...columns.map((_, index) =>
                      index === 0 ? "minmax(0, 1.35fr)" : "minmax(0, 1fr)",
                    ),
                    "132px",
                  ].join(" "),
                }}
              >
                {columns.map((column) => (
                  <span
                    key={column.key}
                    className={[
                      "text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70",
                      column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : "text-left",
                    ].join(" ")}
                  >
                    {column.header}
                  </span>
                ))}
                <span className="text-right text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
                  Actions
                </span>
              </div>

              <div className="space-y-3">
                {visibleRows.map((row) => (
                  <article
                    key={row.id}
                    className="group relative overflow-visible rounded-[22px] border border-border/65 bg-card shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--academic-border)] hover:shadow-[var(--shadow-floating)] motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-[var(--academic-accent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />

                    <div
                      className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 sm:px-5 lg:[grid-template-columns:var(--crud-grid)] lg:items-center"
                      style={{
                        ["--crud-grid" as string]: [
                          ...columns.map((_, index) =>
                            index === 0
                              ? "minmax(0, 1.35fr)"
                              : "minmax(0, 1fr)",
                          ),
                          "132px",
                        ].join(" "),
                      } as CSSProperties}
                    >
                      {columns.map((column, columnIndex) => (
                        <div
                          key={column.key}
                          className={[
                            "min-w-0",
                            columnIndex === 0 ? "lg:pr-4" : "",
                            column.align === "center" ? "lg:text-center" : column.align === "right" ? "lg:text-right" : "lg:text-left",
                          ].join(" ")}
                        >
                          <span className="mb-1 block text-[9px] font-medium uppercase tracking-[0.11em] text-muted-foreground/65 lg:hidden">
                            {column.header}
                          </span>
                          <div className={columnIndex === 0 ? "text-sm font-medium text-foreground" : "text-sm font-normal text-foreground/80"}>
                            {column.render(row)}
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-end border-t border-border/50 pt-3 sm:col-span-2 lg:col-span-1 lg:border-0 lg:pt-0">
                        <RowActions
                          disabled={Boolean(deleteMutation.isPending)}
                          onView={() => void openView(row)}
                          onEdit={() => void openEdit(row)}
                          onDelete={() => setDeletingRow(row)}
                        />
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-5 top-0 h-px w-14 bg-[var(--academic-accent)] opacity-0 transition-opacity duration-200 group-hover:opacity-40"
                    />
                  </article>
                ))}
              </div>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={rows.length}
              firstVisibleRecord={firstVisibleRecord}
              lastVisibleRecord={lastVisibleRecord}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>

      {viewingRow ? (
        <DetailsDrawer
          row={viewingRow}
          columns={columns}
          isLoading={isLoadingDetails}
          error={detailsError}
          onClose={() => {
            if (!isLoadingDetails) {
              setViewingRow(null);
              setDetailsError(null);
            }
          }}
          onEdit={() => {
            const row = viewingRow;
            setViewingRow(null);
            void openEdit(row);
          }}
        />
      ) : null}

      {dialogRow ? (
        <EditorDialog
          title={dialogRow === "new" ? addLabel : `Edit ${title}`}
          fields={fields}
          values={values}
          errors={formErrors}
          isEdit={dialogRow !== "new"}
          isLoading={isLoadingDetails}
          error={detailsError}
          isSubmitting={isSubmitting}
          onChange={(fieldName, value) => {
            setValues((current) => ({ ...current, [fieldName]: value }));
            setFormErrors((current) => ({ ...current, [fieldName]: "" }));
          }}
          onClose={closeDialog}
          onSubmit={submit}
        />
      ) : null}

      <DeleteDialog
        open={deletingRow !== null}
        title={deleteTitle}
        description={deletingRow ? deleteDescription(deletingRow) : ""}
        isPending={Boolean(deleteMutation.isPending)}
        onClose={() => setDeletingRow(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function TableSkeleton({
  columns,
  rows,
}: {
  columns: number;
  rows: number;
}) {
  const gridTemplateColumns = [
    ...Array.from({ length: columns }, (_, index) =>
      index === 0 ? "minmax(0, 1.35fr)" : "minmax(0, 1fr)",
    ),
    "132px",
  ].join(" ");

  return (
    <div className="px-4 py-4 sm:px-5">
      <div
        className="hidden items-center gap-4 px-5 pb-2 lg:grid"
        style={{ gridTemplateColumns }}
      >
        {Array.from({ length: columns + 1 }).map((_, index) => (
          <span
            key={index}
            className="h-2.5 w-20 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: Math.min(rows, 8) }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="rounded-[22px] border border-border/65 bg-card px-5 py-4 shadow-[var(--shadow-card)]"
          >
            <div
              className="grid animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 lg:[grid-template-columns:var(--skeleton-grid)] lg:items-center"
              style={{
                ["--skeleton-grid" as string]: gridTemplateColumns,
              } as CSSProperties}
            >
              {Array.from({ length: columns + 1 }).map((__, columnIndex) => (
                <div key={columnIndex} className="flex min-w-0 items-center gap-3">
                  {columnIndex === 0 ? (
                    <span className="h-10 w-10 shrink-0 rounded-[14px] bg-[var(--academic-soft)]" />
                  ) : null}
                  <div className="w-full space-y-2">
                    <span
                      className={[
                        "block h-3 rounded-full bg-muted",
                        columnIndex === columns ? "ml-auto w-24" : "w-3/5",
                      ].join(" ")}
                    />
                    {columnIndex === 0 ? (
                      <span className="block h-2.5 w-24 rounded-full bg-muted/70" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[14px] border border-border/55 bg-muted/10 px-5 py-3.5">
        <span className="h-3 w-40 animate-pulse rounded-full bg-muted" />
        <span className="h-9 w-56 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function TablePagination({
  currentPage,
  totalPages,
  totalRecords,
  firstVisibleRecord,
  lastVisibleRecord,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  firstVisibleRecord: number;
  lastVisibleRecord: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border/60 bg-muted/[0.10] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-center text-[11px] text-muted-foreground sm:text-start">
        Showing{" "}
        <strong className="font-medium text-foreground">
          {firstVisibleRecord}-{lastVisibleRecord}
        </strong>{" "}
        of{" "}
        <strong className="font-medium text-foreground">
          {totalRecords}
        </strong>
      </p>

      <nav
        aria-label="Table pagination"
        className="flex items-center justify-center gap-2 sm:justify-end"
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground transition hover:border-[var(--academic-border)] hover:bg-[var(--academic-soft)] hover:text-[var(--academic-accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-[var(--academic-accent)] px-3 text-xs font-semibold text-white shadow-sm">
          {currentPage}
        </span>

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground transition hover:border-[var(--academic-border)] hover:bg-[var(--academic-soft)] hover:text-[var(--academic-accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={15} />
        </button>
      </nav>
    </div>
  );
}

function RowActions({
  disabled,
  onView,
  onEdit,
  onDelete,
}: {
  disabled: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <ActionButton
        label="View details"
        variant="view"
        disabled={disabled}
        onClick={onView}
      >
        <Eye size={16} />
      </ActionButton>

      <ActionButton
        label="Edit"
        variant="edit"
        disabled={disabled}
        onClick={onEdit}
      >
        <Pencil size={15} />
      </ActionButton>

      <ActionButton
        label="Delete"
        variant="delete"
        disabled={disabled}
        onClick={onDelete}
      >
        <Trash2 size={15} />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  label,
  variant,
  disabled,
  onClick,
  children,
}: {
  label: string;
  variant: "view" | "edit" | "delete";
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const variantClasses = {
    view: [
      "border-border/70",
      "bg-white",
      "text-muted-foreground",
      "hover:border-[var(--academic-border)]",
      "hover:bg-[var(--academic-soft)]",
      "hover:text-[var(--academic-accent)]",
    ].join(" "),

    edit: [
      "border-[var(--academic-border)]",
      "bg-[var(--academic-soft)]",
      "text-[var(--academic-accent)]",
      "hover:border-[var(--academic-border)]",
      "hover:bg-[var(--academic-soft)]",
    ].join(" "),

    delete: [
      "border-destructive/20",
      "bg-red-50/70",
      "text-destructive",
      "hover:border-red-300",
      "hover:bg-red-100/70",
      "hover:text-red-600",
    ].join(" "),
  };

  function showTooltip() {
    const rect = buttonRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setTooltipPosition({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
  }

  function hideTooltip() {
    setTooltipPosition(null);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={[
          "flex h-9 w-9 items-center justify-center",
          "rounded-xl border",
          "transition-all duration-150",
          "hover:-translate-y-0.5",
          "hover:shadow-sm",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-[var(--academic-ring)]",
          "disabled:cursor-not-allowed",
          "disabled:opacity-40",
          "disabled:hover:translate-y-0",
          variantClasses[variant],
        ].join(" ")}
      >
        {children}
      </button>

      {tooltipPosition && typeof document !== "undefined"
        ? createPortal(
            <span
              role="tooltip"
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
              className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-[10px] font-semibold text-background shadow-xl"
            >
              {label}
              <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
            </span>,
            document.body,
          )
        : null}
    </>
  );
}

function DetailsDrawer<
  TEntity extends BaseEntity,
>({
  row,
  columns,
  isLoading,
  error,
  onClose,
  onEdit,
}: {
  row: TEntity;
  columns: Array<CrudColumn<TEntity>>;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={[
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-foreground/35 p-4 backdrop-blur-[5px]",
      ].join(" ")}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isLoading
        ) {
          onClose();
        }
      }}
    >
      <section
        className={[
          "flex max-h-[calc(100dvh-1rem)] w-full max-w-[720px] flex-col overflow-hidden sm:max-h-[90vh]",
          "rounded-[24px] border border-border/60 bg-card",
          "shadow-[0_28px_90px_rgba(15,10,40,0.22)]",
          "animate-in zoom-in-95 fade-in duration-200",
        ].join(" ")}
      >
        <header
          className={[
            "relative overflow-hidden border-b border-border/60",
            "bg-card px-5 py-4 sm:px-6",
          ].join(" ")}
        >
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[var(--academic-soft)] blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center",
                  "rounded-[14px] border border-[var(--academic-border)]",
                  "bg-[var(--academic-soft)] text-[var(--academic-accent)]",
                ].join(" ")}
              >
                <Eye size={20} strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--academic-accent)]">
                  Record overview
                </p>

                <h2 className="mt-1 text-[17px] font-semibold tracking-tight text-foreground">
                  View details
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Review the complete record information in one place.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close details"
              disabled={isLoading}
              onClick={onClose}
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center",
                "rounded-full border border-border/70 bg-card",
                "text-muted-foreground shadow-sm transition",
                "hover:bg-muted hover:text-foreground",
                "disabled:opacity-50",
              ].join(" ")}
            >
              <X size={17} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 [scrollbar-width:thin]">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: Math.max(columns.length, 4) }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-[84px] animate-pulse rounded-[15px] border border-border/50 bg-muted/25"
                  />
                ),
              )}
            </div>
          ) : error ? (
            <div className="rounded-[15px] border border-destructive/20 bg-destructive/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={20}
                  className="mt-0.5 shrink-0 text-destructive"
                />

                <div>
                  <p className="text-sm font-semibold text-destructive">
                    Failed to load details
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <dl className="grid gap-3 sm:grid-cols-2">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={[
                    "rounded-[15px] border border-border/60",
                    "bg-muted/[0.12] p-4",
                    "transition-colors duration-200",
                    "hover:border-[var(--academic-border)]",
                    "hover:bg-[var(--academic-soft)]",
                  ].join(" ")}
                >
                  <dt className="text-[10px] font-medium uppercase tracking-[0.09em] text-muted-foreground">
                    {column.header}
                  </dt>

                  <dd className="mt-2 break-words text-sm font-medium leading-6 text-foreground">
                    {column.render(row)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <footer
          className={[
            "flex flex-col-reverse gap-3 border-t border-border/60",
            "bg-muted/[0.14] p-5 sm:flex-row sm:justify-end",
          ].join(" ")}
        >
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className={[
              "h-10 rounded-full border border-border/70",
              "bg-card px-6 text-sm font-medium text-foreground",
              "transition hover:bg-muted disabled:opacity-50",
            ].join(" ")}
          >
            Close
          </button>

          <button
            type="button"
            disabled={isLoading || Boolean(error)}
            onClick={onEdit}
            className={[
              "flex h-10 items-center justify-center gap-2",
              "rounded-full bg-[var(--academic-accent)] px-6",
              "text-sm font-semibold text-white shadow-sm transition",
              "hover:-translate-y-0.5 hover:bg-[var(--academic-accent)]/90",
              "disabled:translate-y-0 disabled:opacity-50",
            ].join(" ")}
          >
            <Pencil size={15} />
            Edit record
          </button>
        </footer>
      </section>
    </div>
  );
}

// ✅ تم إزالة الـ Generic من EditorDialog و FieldControl
function EditorDialog({
  title,
  fields,
  values,
  errors,
  isEdit,
  isLoading,
  error,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: {
  title: string;
  fields: Array<CrudField>;
  values: FormValues;
  errors: Record<string, string>;
  isEdit: boolean;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  onChange: (
    name: string,
    value: FormValue,
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={[
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-slate-950/30 p-2 sm:p-4 backdrop-blur-[5px]",
      ].join(" ")}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting &&
          !isLoading
        ) {
          onClose();
        }
      }}
    >
      <div
        className={[
          "flex max-h-[calc(100dvh-1rem)] w-full max-w-[720px] flex-col overflow-hidden sm:max-h-[90vh]",
          "rounded-[24px] border border-border/55 bg-card",
          "shadow-[0_28px_90px_rgba(15,10,40,0.22)]",
          "animate-in zoom-in-95 fade-in duration-200",
        ].join(" ")}
      >
        <header
          className={[
            "relative overflow-hidden",
            "border-b border-border/60",
            "bg-card",
            "px-5 py-4",
          ].join(" ")}
        >
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[var(--academic-soft)] blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center",
                  "justify-center rounded-[14px]",
                  "border border-[var(--academic-border)]",
                  "bg-card text-[var(--academic-accent)] shadow-sm",
                ].join(" ")}
              >
                {isEdit ? (
                  <Pencil size={20} />
                ) : (
                  <Plus size={21} />
                )}
              </span>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--academic-accent)]">
                  {isEdit
                    ? "Update record"
                    : "Create record"}
                </p>

                <h2 className="mt-1 text-[17px] font-semibold tracking-tight text-foreground">
                  {title}
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Enter the details below.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close dialog"
              disabled={isSubmitting || isLoading}
              onClick={onClose}
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center",
                "rounded-full border border-border/70 bg-card",
                "text-muted-foreground shadow-sm transition",
                "hover:bg-muted hover:text-foreground",
                "disabled:opacity-50",
              ].join(" ")}
            >
              <X size={17} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 [scrollbar-width:thin]">
          {isLoading ? (
            <EditorFieldsSkeleton fields={fields} />
          ) : null}

          {error ? (
            <div className="mb-6 rounded-[14px] border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={19}
                  className="mt-0.5 shrink-0 text-destructive"
                />

                <div>
                  <p className="text-sm font-semibold text-destructive">
                    Unable to load the record
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className={["grid gap-4 sm:grid-cols-2", isLoading ? "hidden" : ""].join(" ")}>
            {fields.map((field) => {
              const fieldDisabled =
                typeof field.disabled === "function"
                  ? field.disabled(values, isEdit)
                  : Boolean(field.disabled);

              const disabled = Boolean(
                isSubmitting ||
                isLoading ||
                fieldDisabled ||
                (isEdit && field.disabledOnEdit)
              );

              return (
                <label
                  key={field.name}
                  className={[
                    "block rounded-[14px]",
                    field.full
                      ? "sm:col-span-2"
                      : "",
                  ].join(" ")}
                >
                  <span className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-foreground">
                    {field.label}

                    {field.required ? (
                      <span className="text-destructive">
                        *
                      </span>
                    ) : null}

                    {isEdit &&
                    field.disabledOnEdit ? (
                      <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                        Locked
                      </span>
                    ) : null}
                  </span>

                  <FieldControl
                    field={field}
                    value={values[field.name]}
                    values={values}
                    isEdit={isEdit}
                    disabled={disabled}
                    hasError={Boolean(
                      errors[field.name],
                    )}
                    onChange={(value) => {
                      onChange(field.name, value);

                      for (const dependentField of
                        field.resetFieldsOnChange ?? []) {
                        onChange(dependentField, "");
                      }
                    }}
                  />

                  {field.helperText ? (
                    <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                      {field.helperText}
                    </p>
                  ) : null}

                  {errors[field.name] ? (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-destructive">
                      <AlertTriangle size={12} />
                      {errors[field.name]}
                    </div>
                  ) : null}
                </label>
              );
            })}
          </div>
        </div>

        <footer
          className={[
            "flex flex-col-reverse gap-3",
            "border-t border-border/60",
            "bg-muted/[0.14] p-5",
            "sm:flex-row sm:justify-end",
          ].join(" ")}
        >
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className={[
              "h-10 rounded-full border border-border/70",
              "bg-card px-6 text-sm font-medium text-foreground",
              "transition hover:bg-muted",
              "disabled:opacity-50",
            ].join(" ")}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              isSubmitting ||
              isLoading ||
              Boolean(error)
            }
            onClick={onSubmit}
            className={[
              "flex h-11 items-center justify-center gap-2",
              "rounded-full bg-[var(--academic-accent)] px-6",
              "text-sm font-semibold text-white",
              "shadow-sm transition",
              "hover:-translate-y-0.5",
              "hover:bg-[var(--academic-accent)]/90 hover:shadow-md",
              "disabled:translate-y-0 disabled:opacity-50",
            ].join(" ")}
          >
            {isSubmitting ? (
              <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-white/45" />
            ) : isEdit ? (
              <Pencil size={15} />
            ) : (
              <Plus size={16} />
            )}

            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Create record"}
          </button>
        </footer>
      </div>
    </div>
  );
}

// ✅ تم إزالة الـ Generic من EditorFieldsSkeleton
function EditorFieldsSkeleton({
  fields,
}: {
  fields: Array<CrudField>;
}) {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.name}
          className={field.full ? "sm:col-span-2" : ""}
        >
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="block h-3 w-24 rounded-full bg-muted" />
            {field.disabledOnEdit ? (
              <span className="block h-4 w-12 rounded-full bg-muted/70" />
            ) : null}
          </div>

          {field.type === "checkbox" ? (
            <div className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-muted/10 px-4">
              <span className="h-4 w-4 rounded bg-muted" />
              <span className="h-3 w-20 rounded-full bg-muted" />
            </div>
          ) : field.type === "array" ? (
            <div className="space-y-2 rounded-xl border border-border bg-muted/10 p-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex h-9 items-center gap-3 rounded-xl px-3">
                  <span className="h-4 w-4 rounded bg-muted" />
                  <span className="h-3 w-2/5 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-11 w-full rounded-xl border border-border bg-muted/55" />
          )}

          {field.helperText ? (
            <span className="mt-2 block h-2.5 w-4/5 rounded-full bg-muted/65" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

// ✅ تم إزالة الـ Generic من FieldControl
function FieldControl({
  field,
  value,
  values,
  isEdit,
  disabled,
  hasError,
  onChange,
}: {
  field: CrudField;
  value: FormValue;
  values: FormValues;
  isEdit: boolean;
  disabled: boolean;
  hasError: boolean;
  onChange: (
    value: FormValue,
  ) => void;
}) {
  const baseClass = [
    "w-full rounded-xl border bg-background text-sm font-semibold text-foreground outline-none",
    "focus:border-[var(--academic-accent)] focus:ring-4 focus:ring-[var(--academic-ring)]",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasError
      ? "border-destructive/60"
      : "border-border",
  ].join(" ");

  const resolvedOptions =
    typeof field.options === "function"
      ? field.options(values, isEdit)
      : field.options ?? [];

  if (
    field.type === "checkbox"
  ) {
    return (
      <span className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-muted/10 px-4">
        <input
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              event.target.checked,
            )
          }
          className="h-4 w-4 accent-[var(--academic-accent)]"
        />
        <span className="text-sm font-medium text-foreground">
          Enabled
        </span>
      </span>
    );
  }

  if (field.type === "array") {
    const selectedValues =
      Array.isArray(value)
        ? value.map(String)
        : [];

    return (
      <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-border bg-background p-3">
        {resolvedOptions.map(
          (option) => {
            const checked =
              selectedValues.includes(
                option.value,
              );

            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={
                    disabled
                  }
                  onChange={(
                    event,
                  ) => {
                    const next =
                      event.target
                        .checked
                        ? Array.from(
                            new Set([
                              ...selectedValues,
                              option.value,
                            ]),
                          )
                        : selectedValues.filter(
                            (
                              item,
                            ) =>
                              item !==
                              option.value,
                          );

                    onChange(next);
                  }}
                  className="h-4 w-4 accent-[var(--academic-accent)]"
                />

                <span className="text-sm font-medium text-foreground">
                  {
                    option.label
                  }
                </span>
              </label>
            );
          },
        )}
      </div>
    );
  }

  if (field.type === "select") {
    const selectedValue = String(
      value ?? "",
    );

    return (
      <Select
        value={selectedValue || undefined}
        disabled={disabled}
        onValueChange={(nextValue) =>
          onChange(nextValue)
        }
      >
        <SelectTrigger
          aria-invalid={hasError}
          className={[
            "h-11 w-full rounded-[13px] px-3.5",
            "border bg-background",
            "text-sm font-normal text-foreground",
            "focus:ring-4 focus:ring-[var(--academic-ring)]",
            hasError
              ? "border-destructive/60"
              : "border-border/70",
          ].join(" ")}
        >
          <SelectValue
            placeholder={`Select ${field.label}`}
          />
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={7}
          collisionPadding={16}
          className={[
            "z-[160] max-h-[280px]",
            "rounded-[16px]",
            "border border-border/60",
            "bg-popover p-1.5",
            "shadow-[0_18px_55px_rgba(24,16,55,0.18)]",
          ].join(" ")}
        >
          {resolvedOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-[11px] py-2.5 text-sm font-normal"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <input
      type={field.type}
      value={String(value ?? "")}
      min={field.min}
      max={field.max}
      disabled={disabled}
      onChange={(event) =>
        onChange(
          field.type ===
            "number"
            ? event.target
                .value === ""
              ? ""
              : Number(
                  event.target
                    .value,
                )
            : event.target.value,
        )
      }
      className={`h-11 px-4 ${baseClass}`}
    />
  );
}

function DeleteDialog({
  open,
  title,
  description,
  isPending,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className={[
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-slate-950/30 p-2 sm:p-4 backdrop-blur-[5px]",
      ].join(" ")}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isPending
        ) {
          onClose();
        }
      }}
    >
      <div
        className={[
          "w-full max-w-[480px] overflow-hidden",
          "rounded-[24px] border border-destructive/20 bg-card",
          "shadow-[0_28px_90px_rgba(15,23,42,0.25)]",
          "animate-in zoom-in-95 fade-in duration-200",
        ].join(" ")}
      >
        <div
          className={[
            "relative overflow-hidden border-b border-border/60",
            "bg-card px-6 py-5",
          ].join(" ")}
        >
          <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-red-200/30 blur-3xl" />

          <div className="relative flex items-start gap-4">
            <span
              className={[
                "flex h-10 w-10 shrink-0 items-center",
                "justify-center rounded-[14px]",
                "border border-destructive/20",
                "bg-destructive/[0.08] text-destructive shadow-sm",
              ].join(" ")}
            >
              <Trash2 size={23} />
            </span>

            <div className="pt-0.5">
              <p className="text-[10px] font-medium uppercase tracking-[0.11em] text-destructive">
                Permanent action
              </p>

              <h2 className="mt-1 text-[17px] font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          <div className="mt-5 rounded-[14px] border border-destructive/20 bg-destructive/[0.045] p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-destructive"
              />

              <div>
                <p className="text-xs font-semibold text-destructive">
                  This action cannot be undone
                </p>

                <p className="mt-1 text-[11px] leading-5 text-destructive/75">
                  The server will validate this action before deletion.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer
          className={[
            "flex flex-col-reverse gap-3",
            "border-t border-border/60",
            "bg-muted/[0.14] p-5",
            "sm:flex-row sm:justify-end",
          ].join(" ")}
        >
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className={[
              "h-10 rounded-full border border-border/70",
              "bg-card px-6 text-sm font-medium text-foreground",
              "transition hover:bg-muted",
              "disabled:opacity-50",
            ].join(" ")}
          >
            Keep record
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={[
              "flex h-11 items-center justify-center gap-2",
              "rounded-full bg-destructive px-6",
              "text-sm font-semibold text-white",
              "shadow-sm transition",
              "hover:-translate-y-0.5",
              "hover:bg-destructive/90 hover:shadow-md",
              "disabled:translate-y-0 disabled:opacity-50",
            ].join(" ")}
          >
            {isPending ? (
              <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-white/45" />
            ) : (
              <Trash2 size={16} />
            )}

            {isPending
              ? "Deleting..."
              : "Delete permanently"}
          </button>
        </footer>
      </div>
    </div>
  );
}