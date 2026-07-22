import {
  AlertTriangle,
  Eye,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import {
  useState,
  type ReactNode,
} from "react";

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

export type CrudField<
  TCreate extends object = Record<string, never>,
> = {
  name: keyof TCreate & string;
  label: string;
  type: FieldType;
  options?: Array<{
    label: string;
    value: string;
  }>;
  defaultValue: FormValue;
  required?: boolean;
  full?: boolean;
  min?: number;
  max?: number;
  disabledOnEdit?: boolean;
  helperText?: string;
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

  fields: Array<CrudField<TCreate>>;
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
};

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
}: CrudPageProps<TEntity, TCreate, TUpdate>) {
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

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-border/70 bg-card shadow-soft">
        <div className="text-center">
          <Loader2
            size={26}
            className="mx-auto animate-spin text-primary"
          />
          <p className="mt-3 text-sm font-bold text-foreground">
            Loading {title.toLowerCase()}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-card p-8 text-center shadow-soft">
        <AlertTriangle
          size={28}
          className="mx-auto text-destructive"
        />
        <h1 className="mt-4 text-xl font-bold text-foreground">
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
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
        <header className="flex flex-col gap-4 border-b border-border/60 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-[-0.035em] text-foreground">
              {title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Plus size={17} />
            {addLabel}
          </button>
        </header>

       
        {rows.length === 0 ? (
  <div className="px-6 py-16 text-center">
    <h2 className="text-base font-bold text-foreground">
      {emptyTitle}
    </h2>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
      {emptyDescription}
    </p>

    <button
      type="button"
      onClick={openCreate}
      className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground"
    >
      <Plus size={15} />
      {addLabel}
    </button>
  </div>
) : (
  <div className="relative overflow-x-auto">
  <table className="w-full min-w-[860px] border-separate border-spacing-0">
    <thead>
      <tr className="bg-[#faf9ff]">
        {columns.map((column) => (
          <th
            key={column.key}
            className={[
              "border-b border-border/70 px-6 py-4",
              "text-[11px] font-extrabold uppercase",
              "tracking-[0.055em] text-muted-foreground",
              column.align === "center"
                ? "text-center"
                : column.align === "right"
                  ? "text-right"
                  : "text-left",
            ].join(" ")}
          >
            {column.header}
          </th>
        ))}

        <th
          className={[
            "sticky right-0 z-20",
            "min-w-[174px]",
            "border-b border-l border-border/70",
            "bg-[#faf9ff] px-6 py-4",
            "text-right text-[11px] font-extrabold",
            "uppercase tracking-[0.055em]",
            "text-muted-foreground",
          ].join(" ")}
        >
          Actions
        </th>
      </tr>
    </thead>

    <tbody>
{rows.map((row, rowIndex) => (        <tr
          key={row.id}
          className={[
            "group transition-all duration-200",
            "hover:bg-primary/[0.035]",
            rowIndex % 2 === 0
              ? "bg-card"
              : "bg-muted/[0.12]",
          ].join(" ")}
        >
          {columns.map((column, columnIndex) => (
            <td
              key={column.key}
              className={[
                "border-b border-border/50 px-6 py-[18px]",
                "text-sm text-foreground",
                "align-middle transition-colors",
                columnIndex === 0
                  ? "font-bold"
                  : "font-medium",
                column.align === "center"
                  ? "text-center"
                  : column.align === "right"
                    ? "text-right"
                    : "text-left",
              ].join(" ")}
            >
              {column.render(row)}
            </td>
          ))}

          <td
            className={[
              "sticky right-0 z-10",
              "border-b border-l border-border/50",
              "px-5 py-4 text-right",
              "transition-colors duration-200",
              rowIndex % 2 === 0
                ? "bg-card"
                : "bg-[#fcfbff]",
              "group-hover:bg-[#f8f5ff]",
            ].join(" ")}
          >
            <RowActions
              disabled={Boolean(
                deleteMutation.isPending,
              )}
              onView={() => {
                void openView(row);
              }}
              onEdit={() => {
                void openEdit(row);
              }}
              onDelete={() => {
                setDeletingRow(row);
              }}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        )}
      </section>

      {viewingRow ? (
        <DetailsDrawer
          row={viewingRow}
          columns={columns}
          isLoading={
            isLoadingDetails
          }
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
          title={
            dialogRow === "new"
              ? addLabel
              : `Edit ${title}`
          }
          fields={fields}
          values={values}
          errors={formErrors}
          isEdit={
            dialogRow !== "new"
          }
          isLoading={
            isLoadingDetails
          }
          error={detailsError}
          isSubmitting={
            isSubmitting
          }
          onChange={(
            fieldName,
            value,
          ) => {
            setValues(
              (current) => ({
                ...current,
                [fieldName]: value,
              }),
            );
            setFormErrors(
              (current) => ({
                ...current,
                [fieldName]: "",
              }),
            );
          }}
          onClose={closeDialog}
          onSubmit={submit}
        />
      ) : null}

      <DeleteDialog
        open={
          deletingRow !== null
        }
        title={deleteTitle}
        description={
          deletingRow
            ? deleteDescription(
                deletingRow,
              )
            : ""
        }
        isPending={Boolean(
          deleteMutation.isPending,
        )}
        onClose={() =>
          setDeletingRow(null)
        }
        onConfirm={confirmDelete}
      />
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
    <div className="inline-flex items-center justify-end gap-2">
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
  const variantClasses = {
    view: [
      "border-slate-200",
      "bg-white",
      "text-slate-500",
      "hover:border-primary/30",
      "hover:bg-primary/5",
      "hover:text-primary",
    ].join(" "),

    edit: [
      "border-primary/20",
      "bg-primary/5",
      "text-primary",
      "hover:border-primary/35",
      "hover:bg-primary/10",
    ].join(" "),

    delete: [
      "border-red-200",
      "bg-red-50/70",
      "text-red-500",
      "hover:border-red-300",
      "hover:bg-red-100/70",
      "hover:text-red-600",
    ].join(" "),
  };

  return (
    <div className="group/action relative">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={[
          "flex h-9 w-9 items-center justify-center",
          "rounded-xl border",
          "transition-all duration-150",
          "hover:-translate-y-0.5",
          "hover:shadow-sm",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/15",
          "disabled:cursor-not-allowed",
          "disabled:opacity-40",
          "disabled:hover:translate-y-0",
          variantClasses[variant],
        ].join(" ")}
      >
        {children}
      </button>

      <span
        role="tooltip"
        className={[
          "pointer-events-none absolute bottom-full left-1/2 z-50",
          "mb-2 -translate-x-1/2 whitespace-nowrap",
          "rounded-lg bg-slate-950 px-2.5 py-1.5",
          "text-[10px] font-bold text-white",
          "opacity-0 shadow-xl transition-opacity",
          "group-hover/action:opacity-100",
          "group-focus-within/action:opacity-100",
        ].join(" ")}
      >
        {label}

        <span
          className={[
            "absolute left-1/2 top-full",
            "-translate-x-1/2",
            "border-4 border-transparent",
            "border-t-slate-950",
          ].join(" ")}
        />
      </span>
    </div>
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
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isLoading
        ) {
          onClose();
        }
      }}
    >
      <aside
        className={[
          "absolute inset-y-0 right-0",
          "flex w-full max-w-[480px] flex-col",
          "border-l border-border/70 bg-card",
          "shadow-[-24px_0_60px_rgba(15,23,42,0.16)]",
          "animate-in slide-in-from-right duration-300",
        ].join(" ")}
      >
        <header
          className={[
            "relative overflow-hidden",
            "border-b border-border/60",
            "bg-gradient-to-br",
            "from-primary/[0.12]",
            "via-primary/[0.045]",
            "to-card",
            "px-6 py-6",
          ].join(" ")}
        >
          <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span
                className={[
                  "flex h-12 w-12 shrink-0 items-center",
                  "justify-center rounded-2xl",
                  "border border-primary/15",
                  "bg-card text-primary shadow-sm",
                ].join(" ")}
              >
                <Eye size={21} />
              </span>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-primary">
                  Record information
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">
                  View details
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Latest information retrieved from the server.
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
                "rounded-xl border border-border/70 bg-card",
                "text-muted-foreground shadow-sm transition",
                "hover:bg-muted hover:text-foreground",
                "disabled:opacity-50",
              ].join(" ")}
            >
              <X size={17} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Loader2
                    size={24}
                    className="animate-spin text-primary"
                  />
                </span>

                <p className="mt-4 text-sm font-bold text-foreground">
                  Loading details
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Retrieving the latest record information.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
              <AlertTriangle
                size={22}
                className="text-destructive"
              />

              <p className="mt-3 text-sm font-bold text-destructive">
                Failed to load details
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {error}
              </p>
            </div>
          ) : (
            <dl className="grid gap-3">
              {columns.map((column, index) => (
                <div
                  key={column.key}
                  className={[
                    "group rounded-2xl border border-border/60",
                    "bg-muted/[0.14] p-4",
                    "transition-all duration-200",
                    "hover:border-primary/20",
                    "hover:bg-primary/[0.035]",
                    "hover:shadow-sm",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center",
                        "justify-center rounded-xl",
                        "bg-primary/10 text-[11px]",
                        "font-black text-primary",
                      ].join(" ")}
                    >
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <dt className="text-[10px] font-extrabold uppercase tracking-[0.075em] text-muted-foreground">
                        {column.header}
                      </dt>

                      <dd className="mt-1.5 break-words text-sm font-bold text-foreground">
                        {column.render(row)}
                      </dd>
                    </div>
                  </div>
                </div>
              ))}
            </dl>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-border/60 bg-muted/[0.14] p-5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className={[
              "h-10 rounded-xl border border-border/70",
              "bg-card px-5 text-xs font-bold text-foreground",
              "transition hover:bg-muted",
              "disabled:opacity-50",
            ].join(" ")}
          >
            Close
          </button>

          <button
            type="button"
            disabled={isLoading || Boolean(error)}
            onClick={onEdit}
            className={[
              "flex h-10 items-center gap-2 rounded-xl",
              "bg-primary px-5 text-xs font-bold",
              "text-primary-foreground shadow-sm transition",
              "hover:-translate-y-0.5 hover:bg-primary/90",
              "disabled:translate-y-0 disabled:opacity-50",
            ].join(" ")}
          >
            <Pencil size={14} />
            Edit record
          </button>
        </footer>
      </aside>
    </div>
  );
}

function EditorDialog<
  TCreate extends object,
>({
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
  fields: Array<CrudField<TCreate>>;
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
        "bg-slate-950/50 p-4 backdrop-blur-[3px]",
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
          "max-h-[92vh] w-full max-w-2xl overflow-hidden",
          "rounded-[28px] border border-border/70 bg-card",
          "shadow-[0_28px_90px_rgba(15,23,42,0.24)]",
          "animate-in zoom-in-95 fade-in duration-200",
        ].join(" ")}
      >
        <header
          className={[
            "relative overflow-hidden",
            "border-b border-border/60",
            "bg-gradient-to-br",
            "from-primary/[0.11]",
            "via-primary/[0.035]",
            "to-card",
            "px-6 py-6",
          ].join(" ")}
        >
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span
                className={[
                  "flex h-12 w-12 shrink-0 items-center",
                  "justify-center rounded-2xl",
                  "border border-primary/15",
                  "bg-card text-primary shadow-sm",
                ].join(" ")}
              >
                {isEdit ? (
                  <Pencil size={20} />
                ) : (
                  <Plus size={21} />
                )}
              </span>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-primary">
                  {isEdit
                    ? "Update record"
                    : "Create record"}
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">
                  {title}
                </h2>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Complete the required information and save your changes.
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
                "rounded-xl border border-border/70 bg-card",
                "text-muted-foreground shadow-sm transition",
                "hover:bg-muted hover:text-foreground",
                "disabled:opacity-50",
              ].join(" ")}
            >
              <X size={17} />
            </button>
          </div>
        </header>

        <div className="max-h-[62vh] overflow-y-auto p-6">
          {isLoading ? (
            <div className="mb-6 flex h-28 items-center justify-center rounded-2xl border border-border/50 bg-muted/20">
              <div className="text-center">
                <Loader2
                  size={23}
                  className="mx-auto animate-spin text-primary"
                />

                <p className="mt-3 text-xs font-bold text-muted-foreground">
                  Loading the latest record
                </p>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={19}
                  className="mt-0.5 shrink-0 text-destructive"
                />

                <div>
                  <p className="text-sm font-bold text-destructive">
                    Unable to load the record
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => {
              const disabled =
                isSubmitting ||
                isLoading ||
                (isEdit &&
                  field.disabledOnEdit);

              return (
                <label
                  key={field.name}
                  className={[
                    "block rounded-2xl",
                    field.full
                      ? "md:col-span-2"
                      : "",
                  ].join(" ")}
                >
                  <span className="mb-2 flex items-center gap-1 text-xs font-extrabold text-foreground">
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
                    disabled={disabled}
                    hasError={Boolean(
                      errors[field.name],
                    )}
                    onChange={(value) =>
                      onChange(
                        field.name,
                        value,
                      )
                    }
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
              "h-11 rounded-xl border border-border/70",
              "bg-card px-6 text-sm font-bold text-foreground",
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
              "rounded-xl bg-primary px-6",
              "text-sm font-bold text-primary-foreground",
              "shadow-sm transition",
              "hover:-translate-y-0.5",
              "hover:bg-primary/90 hover:shadow-md",
              "disabled:translate-y-0 disabled:opacity-50",
            ].join(" ")}
          >
            {isSubmitting ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
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

function FieldControl<
  TCreate extends object,
>({
  field,
  value,
  disabled,
  hasError,
  onChange,
}: {
  field: CrudField<TCreate>;
  value: FormValue;
  disabled: boolean;
  hasError: boolean;
  onChange: (
    value: FormValue,
  ) => void;
}) {
  const baseClass = [
    "w-full rounded-xl border bg-background text-sm font-semibold text-foreground outline-none",
    "focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasError
      ? "border-destructive/60"
      : "border-border",
  ].join(" ");

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
          className="h-4 w-4 accent-primary"
        />
        <span className="text-sm font-semibold text-foreground">
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
        {field.options?.map(
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
                  className="h-4 w-4 accent-primary"
                />

                <span className="text-sm font-semibold text-foreground">
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
    return (
      <select
        value={String(
          value ?? "",
        )}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className={`h-11 px-4 ${baseClass}`}
      >
        <option value="">
          Select {field.label}
        </option>

        {field.options?.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          ),
        )}
      </select>
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
        "bg-slate-950/50 p-4 backdrop-blur-[3px]",
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
          "w-full max-w-md overflow-hidden",
          "rounded-[28px] border border-red-200/70 bg-card",
          "shadow-[0_28px_90px_rgba(15,23,42,0.25)]",
          "animate-in zoom-in-95 fade-in duration-200",
        ].join(" ")}
      >
        <div
          className={[
            "relative overflow-hidden",
            "bg-gradient-to-br",
            "from-red-50 via-card to-card",
            "px-6 pb-5 pt-6",
          ].join(" ")}
        >
          <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-red-200/30 blur-3xl" />

          <div className="relative flex items-start gap-4">
            <span
              className={[
                "flex h-14 w-14 shrink-0 items-center",
                "justify-center rounded-2xl",
                "border border-red-200",
                "bg-red-50 text-red-500 shadow-sm",
              ].join(" ")}
            >
              <Trash2 size={23} />
            </span>

            <div className="pt-0.5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.11em] text-red-500">
                Permanent action
              </p>

              <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">
                {title}
              </h2>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          <div className="mt-5 rounded-2xl border border-red-200/70 bg-red-50/70 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="text-xs font-bold text-red-700">
                  This action cannot be undone
                </p>

                <p className="mt-1 text-[11px] leading-5 text-red-600/80">
                  Related records may prevent deletion. The server will validate the operation before removing this item.
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
              "h-11 rounded-xl border border-border/70",
              "bg-card px-6 text-sm font-bold text-foreground",
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
              "rounded-xl bg-red-500 px-6",
              "text-sm font-bold text-white",
              "shadow-sm transition",
              "hover:-translate-y-0.5",
              "hover:bg-red-600 hover:shadow-md",
              "disabled:translate-y-0 disabled:opacity-50",
            ].join(" ")}
          >
            {isPending ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
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
