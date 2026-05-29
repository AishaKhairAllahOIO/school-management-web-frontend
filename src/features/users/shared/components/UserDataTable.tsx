import { Edit3, Eye, Trash2 } from "lucide-react";

import type { AccountStatus, RecordStatus } from "../types/user.enums";
import type { CrudColumn } from "../types/user-crud.types";

type BaseTableItem = {
  recordStatus: RecordStatus;
  accountStatus: AccountStatus;
};

type UserDataTableProps<T extends BaseTableItem> = {
  items: T[];
  columns: CrudColumn<T>[];
  getId: (item: T) => string;
  onView: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onChangeRecordStatus: (item: T, status: RecordStatus) => void;
  onChangeAccountStatus: (item: T, status: AccountStatus) => void;
};

export function UserDataTable<T extends BaseTableItem>({
  items,
  columns,
  getId,
  onView,
  onEdit,
  onDelete,
  onChangeRecordStatus,
  onChangeAccountStatus,
}: UserDataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-border/80 bg-card/95 shadow-soft-lg">
      <div className="overflow-x-auto">
        <table className="min-w-[1080px]">
          <thead>
            <tr className="bg-secondary/70 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-text-secondary">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className="border-b border-r border-border/80 px-4 py-4 last:border-r-0"
                >
                  {column.title}
                </th>
              ))}

              <th className="border-b border-border/80 px-4 py-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/80">
            {items.map((item) => (
              <tr
                key={getId(item)}
                className="transition-all duration-200 hover:bg-primary/5"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="border-r border-border/60 px-4 py-4 text-center align-middle last:border-r-0"
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] ?? "")}
                  </td>
                ))}

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <select
                      value={item.recordStatus}
                      onChange={(event) =>
                        onChangeRecordStatus(
                          item,
                          event.target.value as RecordStatus
                        )
                      }
                      className="h-9 rounded-xl border border-border/70 bg-background px-2 text-xs font-semibold text-foreground"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                      <option value="deleted">Deleted</option>
                    </select>

                    <select
                      value={item.accountStatus}
                      onChange={(event) =>
                        onChangeAccountStatus(
                          item,
                          event.target.value as AccountStatus
                        )
                      }
                      className="h-9 rounded-xl border border-border/70 bg-background px-2 text-xs font-semibold text-foreground"
                    >
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onView(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background text-info transition hover:bg-info/10"
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background text-primary transition hover:bg-primary/10"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}