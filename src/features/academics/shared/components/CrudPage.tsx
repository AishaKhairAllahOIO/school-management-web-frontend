import { useState } from "react";

import { ActionMenu } from "./ActionMenu";
import { AcademicsPageShell } from "./AcademicsPageShell";
import { EntityDialog } from "./EntityDialog";
import { EntityTable } from "./EntityTable";
import { FormField, inputClass } from "./FormField";
import { formatDateTime } from "../utils/date";

type FieldType = "text" | "number" | "checkbox" | "date" | "select" | "array";

export type CrudField<TCreate extends object> = {
  name: keyof TCreate & string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  defaultValue: string | number | boolean | string[] | null;
  full?: boolean;
};

export type CrudColumn<TEntity> = {
  key: string;
  header: string;
  render: (row: TEntity) => React.ReactNode;
};

type Props<TEntity extends { id: string; createdAt: string; updatedAt: string }, TCreate extends object, TUpdate extends object> = {
  title: string;
  description: string;
  addLabel: string;
  rows: TEntity[];
  isLoading?: boolean;
  fields: CrudField<TCreate>[];
  columns: CrudColumn<TEntity>[];
  createMutation: { mutate: (payload: TCreate) => void; isPending?: boolean };
  updateMutation: { mutate: (input: { id: string; payload: TUpdate }) => void; isPending?: boolean };
  deleteMutation: { mutate: (id: string) => void; isPending?: boolean };
  toFormValues: (row: TEntity) => Record<string, unknown>;
  buildPayload: (values: Record<string, unknown>) => TCreate;
  buildUpdatePayload?: (values: Record<string, unknown>) => TUpdate;
};

export function CrudPage<TEntity extends { id: string; createdAt: string; updatedAt: string }, TCreate extends object, TUpdate extends object>({
  title,
  description,
  addLabel,
  rows,
  isLoading,
  fields,
  columns,
  createMutation,
  updateMutation,
  deleteMutation,
  toFormValues,
  buildPayload,
  buildUpdatePayload,
}: Props<TEntity, TCreate, TUpdate>) {
  const [dialogRow, setDialogRow] = useState<TEntity | "new" | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});

  function openCreate() {
    const initial: Record<string, unknown> = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue;
    });
    setValues(initial);
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
      createMutation.mutate(buildPayload(values));
    } else if (dialogRow) {
      const updatePayload = buildUpdatePayload
        ? buildUpdatePayload(values)
        : (buildPayload(values) as unknown as TUpdate);
      updateMutation.mutate({ id: dialogRow.id, payload: updatePayload });
    }
    closeDialog();
  }

  return (
    <AcademicsPageShell title={title} description={description} addLabel={addLabel} onAdd={openCreate}>
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">Loading...</div>
      ) : (
        <EntityTable
          columns={[
            ...columns,
            { key: "createdAt", header: "Created At", render: (row) => formatDateTime(row.createdAt) },
            { key: "updatedAt", header: "Updated At", render: (row) => formatDateTime(row.updatedAt) },
          ]}
          rows={rows}
          getRowId={(row) => row.id}
          emptyText={`No ${title.toLowerCase()} found.`}
          actions={(row) => (
            <ActionMenu
              onEdit={() => openEdit(row)}
              onDelete={() => {
                if (confirm("Delete this record?")) deleteMutation.mutate(row.id);
              }}
            />
          )}
        />
      )}

      {dialogRow && (
        <EntityDialog title={dialogRow === "new" ? addLabel : `Edit ${title}`} onClose={closeDialog} onSubmit={submit}>
          {fields.map((field) => (
            <FormField key={field.name} label={field.label} full={field.full}>
              {field.type === "checkbox" ? (
                <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={Boolean(values[field.name])}
                    onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.checked }))}
                  />
                  Enabled
                </label>
              ) : field.type === "select" ? (
                <select
                  value={String(values[field.name] ?? "")}
                  onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                  className={inputClass}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === "array" ? (
                <input
                  value={Array.isArray(values[field.name]) ? (values[field.name] as string[]).join(", ") : String(values[field.name] ?? "")}
                  onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))}
                  className={inputClass}
                  placeholder="value-1, value-2"
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  value={String(values[field.name] ?? "")}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.name]: field.type === "number" ? Number(event.target.value) : event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              )}
            </FormField>
          ))}
        </EntityDialog>
      )}
    </AcademicsPageShell>
  );
}
