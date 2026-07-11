import {
  useState,
  type ReactNode,
} from "react";

import { AcademicsPageShell } from "./AcademicsPageShell";
import { ActionMenu } from "./ActionMenu";
import { EntityDialog } from "./EntityDialog";
import { EntityTable } from "./EntityTable";
import {
  FormField,
  inputClass,
} from "./FormField";
import { formatDateTime } from "../utils/date";

type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type FormValues = Record<string, unknown>;

type FieldType =
  | "text"
  | "number"
  | "checkbox"
  | "date"
  | "select"
  | "array";

export type CrudField<
  TCreate extends object = Record<string, unknown>,
> = {
  name: keyof TCreate & string;
  label: string;
  type: FieldType;

  options?: Array<{
    label: string;
    value: string;
  }>;

  defaultValue:
    | string
    | number
    | boolean
    | string[]
    | null;

  full?: boolean;
};

export type CrudColumn<TEntity> = {
  key: string;
  header: string;
  render: (row: TEntity) => ReactNode;
};

type MutationState<TPayload> = {
  mutate: (payload: TPayload) => void;
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

  fields: Array<CrudField<TCreate>>;
  columns: Array<CrudColumn<TEntity>>;

  createMutation: MutationState<TCreate>;

  updateMutation: MutationState<{
    id: string;
    payload: TUpdate;
  }>;

  deleteMutation?: MutationState<string>;

  toFormValues: (
    row: TEntity,
  ) => FormValues;

  buildPayload: (
    values: FormValues,
  ) => TCreate;

  buildUpdatePayload?: (
    values: FormValues,
    currentRow: TEntity,
  ) => TUpdate;
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
  fields,
  columns,
  createMutation,
  updateMutation,
  deleteMutation,
  toFormValues,
  buildPayload,
  buildUpdatePayload,
}: CrudPageProps<TEntity, TCreate, TUpdate>) {
  const [dialogRow, setDialogRow] =
    useState<TEntity | "new" | null>(null);

  const [values, setValues] =
    useState<FormValues>({});

  function openCreate() {
    const initialValues: FormValues = {};

    for (const field of fields) {
      initialValues[field.name] =
        field.defaultValue;
    }

    setValues(initialValues);
    setDialogRow("new");
  }

  function openEdit(row: TEntity) {
    setValues(toFormValues(row));
    setDialogRow(row);
  }

  function closeDialog() {
    setDialogRow(null);
    setValues({});
  }

  function submit() {
    if (dialogRow === "new") {
      createMutation.mutate(
        buildPayload(values),
      );

      closeDialog();
      return;
    }

    if (!dialogRow) {
      return;
    }

    const updatePayload =
      buildUpdatePayload?.(
        values,
        dialogRow,
      ) ??
      (buildPayload(
        values,
      ) as unknown as TUpdate);

    if (Object.keys(updatePayload).length === 0) {
      closeDialog();
      return;
    }

    updateMutation.mutate({
      id: dialogRow.id,
      payload: updatePayload,
    });

    closeDialog();
  }

  const isSubmitting =
    Boolean(createMutation.isPending) ||
    Boolean(updateMutation.isPending);

  return (
    <AcademicsPageShell
      title={title}
      description={description}
      addLabel={addLabel}
      onAdd={openCreate}
    >
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
          Loading...
        </div>
      ) : (
        <EntityTable<TEntity>
          columns={[
            ...columns,
            {
              key: "createdAt",
              header: "Created At",
              render: (row) =>
                formatDateTime(row.createdAt),
            },
            {
              key: "updatedAt",
              header: "Updated At",
              render: (row) =>
                formatDateTime(row.updatedAt),
            },
          ]}
          rows={rows}
          getRowId={(row) => row.id}
          emptyText={`No ${title.toLowerCase()} found.`}
          actions={(row) => (
            <ActionMenu
              onEdit={() => openEdit(row)}
              onDelete={
                deleteMutation
                  ? () => {
                      const confirmed =
                        window.confirm(
                          "Delete this record?",
                        );

                      if (confirmed) {
                        deleteMutation.mutate(
                          row.id,
                        );
                      }
                    }
                  : undefined
              }
            />
          )}
        />
      )}

      {dialogRow ? (
        <EntityDialog
          title={
            dialogRow === "new"
              ? addLabel
              : `Edit ${title}`
          }
          onClose={closeDialog}
          onSubmit={submit}
          submitLabel={
            isSubmitting
              ? "Saving..."
              : "Save"
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                full={field.full}
              >
                {field.type === "checkbox" ? (
                  <label className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3">
                    <input
                      type="checkbox"
                      checked={Boolean(
                        values[field.name],
                      )}
                      onChange={(event) =>
                        setValues(
                          (previousValues) => ({
                            ...previousValues,
                            [field.name]:
                              event.target.checked,
                          }),
                        )
                      }
                    />

                    <span className="text-sm font-bold text-slate-700">
                      Enabled
                    </span>
                  </label>
                ) : field.type === "select" ? (
                  <select
                    value={String(
                      values[field.name] ?? "",
                    )}
                    onChange={(event) =>
                      setValues(
                        (previousValues) => ({
                          ...previousValues,
                          [field.name]:
                            event.target.value,
                        }),
                      )
                    }
                    className={inputClass}
                  >
                    {field.options?.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                ) : field.type === "array" ? (
                  <input
                    type="text"
                    value={
                      Array.isArray(
                        values[field.name],
                      )
                        ? (
                            values[
                              field.name
                            ] as string[]
                          ).join(", ")
                        : ""
                    }
                    onChange={(event) =>
                      setValues(
                        (previousValues) => ({
                          ...previousValues,
                          [field.name]:
                            event.target.value
                              .split(",")
                              .map((item) =>
                                item.trim(),
                              )
                              .filter(Boolean),
                        }),
                      )
                    }
                    className={inputClass}
                    placeholder="value-1, value-2"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={String(
                      values[field.name] ?? "",
                    )}
                    onChange={(event) =>
                      setValues(
                        (previousValues) => ({
                          ...previousValues,

                          [field.name]:
                            field.type ===
                            "number"
                              ? Number(
                                  event.target.value,
                                )
                              : event.target.value,
                        }),
                      )
                    }
                    className={inputClass}
                  />
                )}
              </FormField>
            ))}
          </div>
        </EntityDialog>
      ) : null}
    </AcademicsPageShell>
  );
}