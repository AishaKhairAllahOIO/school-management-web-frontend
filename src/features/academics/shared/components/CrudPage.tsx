import {
  AlertTriangle,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BaseEntity = {
  id: string;
};

type FormValue = string | number | boolean | null;
type FormValues = Record<string, FormValue>;

type FieldType = "text" | "number" | "checkbox" | "select";

export type CrudField<TCreate extends object = Record<string, never>> = {
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

export type CrudColumn<TEntity extends BaseEntity> = {
  key: string;
  header: string;
  render: (row: TEntity) => ReactNode;
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

  toFormValues: (row: TEntity) => FormValues;
  buildPayload: (values: FormValues) => TCreate;
  buildUpdatePayload: (
    values: FormValues,
    currentRow: TEntity,
  ) => TUpdate;

  emptyTitle?: string;
  emptyDescription?: string;
  deleteTitle?: string;
  deleteDescription?: (row: TEntity) => string;
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
  const [dialogRow, setDialogRow] = useState<TEntity | "new" | null>(
    null,
  );
  const [values, setValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>(
    {},
  );
  const [deletingRow, setDeletingRow] = useState<TEntity | null>(
    null,
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(
    null,
  );

  function openCreate() {
    const initialValues: FormValues = {};

    for (const field of fields) {
      initialValues[field.name] = field.defaultValue;
    }

    setValues(initialValues);
    setFormErrors({});
    setDetailsError(null);
    setDialogRow("new");
  }

  async function openEdit(row: TEntity) {
    setFormErrors({});
    setDetailsError(null);
    setDialogRow(row);
    setValues(toFormValues(row));

    if (!loadEntity) {
      return;
    }

    setIsLoadingDetails(true);

    try {
      const latest = await loadEntity(row.id);
      setDialogRow(latest);
      setValues(toFormValues(latest));
    } catch {
      setDetailsError(
        "The latest record details could not be loaded.",
      );
    } finally {
      setIsLoadingDetails(false);
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
    const nextErrors: Record<string, string> = {};

    for (const field of fields) {
      const value = values[field.name];

      if (
        field.required &&
        (value === "" || value === null || value === undefined)
      ) {
        nextErrors[field.name] = `${field.label} is required.`;
        continue;
      }

      if (field.type === "number" && value !== "" && value !== null) {
        const numberValue = Number(value);

        if (!Number.isFinite(numberValue)) {
          nextErrors[field.name] = `Enter a valid ${field.label.toLowerCase()}.`;
        } else if (
          field.min !== undefined &&
          numberValue < field.min
        ) {
          nextErrors[field.name] = `${field.label} must be at least ${field.min}.`;
        } else if (
          field.max !== undefined &&
          numberValue > field.max
        ) {
          nextErrors[field.name] = `${field.label} must not exceed ${field.max}.`;
        }
      }
    }

    setFormErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function submit() {
    if (!validate()) {
      return;
    }

    if (dialogRow === "new") {
      createMutation.mutate(buildPayload(values), {
        onSuccess: closeDialog,
      });
      return;
    }

    if (!dialogRow) {
      return;
    }

    const updatePayload = buildUpdatePayload(values, dialogRow);

    if (Object.keys(updatePayload).length === 0) {
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

    deleteMutation.mutate(deletingRow.id, {
      onSuccess: () => setDeletingRow(null),
    });
  }

  const isSubmitting =
    Boolean(createMutation.isPending) ||
    Boolean(updateMutation.isPending);

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-border/70 bg-card">
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
      <div className="rounded-3xl border border-destructive/20 bg-card p-8 text-center">
        <AlertTriangle
          size={28}
          className="mx-auto text-destructive"
        />
        <h1 className="mt-4 text-xl font-bold text-foreground">
          Failed to load {title.toLowerCase()}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The data could not be retrieved from the server.
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
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
        >
          <Plus size={17} />
          {addLabel}
        </button>
      </header>

      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
        <div className="border-b border-border/60 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage records using the actions menu.
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {rows.length}
            </span>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-14 text-center">
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-5 py-3 text-xs font-bold text-muted-foreground"
                    >
                      {column.header}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-right text-xs font-bold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/50 last:border-b-0 hover:bg-muted/20"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-5 py-4 text-sm text-foreground"
                      >
                        {column.render(row)}
                      </td>
                    ))}
                    <td className="px-5 py-4 text-right">
                      <RowActions
                        disabled={Boolean(deleteMutation.isPending)}
                        onEdit={() => void openEdit(row)}
                        onDelete={() => setDeletingRow(row)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {dialogRow ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDialog();
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <header className="flex items-start justify-between border-b border-border/60 p-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {dialogRow === "new" ? addLabel : `Edit ${title}`}
                </h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Complete the required fields, then save the changes.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                disabled={isSubmitting || isLoadingDetails}
                onClick={closeDialog}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </header>

            <div className="p-6">
              {isLoadingDetails ? (
                <div className="mb-5 flex h-24 items-center justify-center rounded-2xl bg-muted/20">
                  <Loader2
                    size={22}
                    className="animate-spin text-primary"
                  />
                </div>
              ) : null}

              {detailsError ? (
                <div className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-semibold text-destructive">
                  {detailsError}
                </div>
              ) : null}

              <div className="grid gap-5 md:grid-cols-2">
                {fields.map((field) => {
                  const isEdit = dialogRow !== "new";
                  const disabled =
                    isSubmitting ||
                    isLoadingDetails ||
                    (isEdit && field.disabledOnEdit);

                  return (
                    <label
                      key={field.name}
                      className={field.full ? "md:col-span-2" : ""}
                    >
                      <span className="mb-2 block text-xs font-bold text-foreground">
                        {field.label}
                        {field.required ? (
                          <span className="text-destructive"> *</span>
                        ) : null}
                      </span>

                      {field.type === "checkbox" ? (
                        <span className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-muted/10 px-4">
                          <input
                            type="checkbox"
                            checked={Boolean(values[field.name])}
                            disabled={disabled}
                            onChange={(event) =>
                              setValues((current) => ({
                                ...current,
                                [field.name]: event.target.checked,
                              }))
                            }
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="text-sm font-semibold text-foreground">
                            Enabled
                          </span>
                        </span>
                      ) : field.type === "select" ? (
                        <select
                          value={String(values[field.name] ?? "")}
                          disabled={disabled}
                          onChange={(event) => {
                            setValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }));
                            setFormErrors((current) => ({
                              ...current,
                              [field.name]: "",
                            }));
                          }}
                          className={[
                            "h-11 w-full rounded-xl border bg-background px-4 text-sm font-semibold text-foreground outline-none",
                            "focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60",
                            formErrors[field.name]
                              ? "border-destructive/60"
                              : "border-border",
                          ].join(" ")}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={String(values[field.name] ?? "")}
                          min={field.min}
                          max={field.max}
                          disabled={disabled}
                          onChange={(event) => {
                            const value =
                              field.type === "number"
                                ? event.target.value === ""
                                  ? ""
                                  : Number(event.target.value)
                                : event.target.value;

                            setValues((current) => ({
                              ...current,
                              [field.name]: value,
                            }));
                            setFormErrors((current) => ({
                              ...current,
                              [field.name]: "",
                            }));
                          }}
                          className={[
                            "h-11 w-full rounded-xl border bg-background px-4 text-sm font-semibold text-foreground outline-none",
                            "focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60",
                            formErrors[field.name]
                              ? "border-destructive/60"
                              : "border-border",
                          ].join(" ")}
                        />
                      )}

                      {field.helperText ? (
                        <p className="mt-1.5 text-[11px] leading-4 text-muted-foreground">
                          {field.helperText}
                        </p>
                      ) : null}

                      {formErrors[field.name] ? (
                        <p className="mt-1.5 text-[11px] font-semibold text-destructive">
                          {formErrors[field.name]}
                        </p>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>

            <footer className="flex justify-end gap-3 border-t border-border/60 bg-muted/10 p-5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={closeDialog}
                className="h-10 rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  isSubmitting || isLoadingDetails || Boolean(detailsError)
                }
                onClick={submit}
                className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : dialogRow === "new" ? (
                  <Plus size={15} />
                ) : (
                  <Pencil size={15} />
                )}
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      <DeleteDialog
        open={deletingRow !== null}
        title={deleteTitle}
        description={
          deletingRow
            ? deleteDescription(deletingRow)
            : ""
        }
        isPending={Boolean(deleteMutation.isPending)}
        onClose={() => setDeletingRow(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function RowActions({
  disabled,
  onEdit,
  onDelete,
}: {
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label="Open actions"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted disabled:opacity-50"
      >
        <MoreVertical size={16} />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-20 w-36 rounded-2xl border border-border bg-card p-1.5 shadow-xl">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      ) : null}
    </div>
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
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle size={22} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-border/60 bg-muted/10 p-5">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="h-10 rounded-xl border border-border bg-card px-5 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="flex h-10 items-center gap-2 rounded-xl bg-destructive px-5 text-xs font-bold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={15} />
            )}
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </footer>
      </div>
    </div>
  );
}
