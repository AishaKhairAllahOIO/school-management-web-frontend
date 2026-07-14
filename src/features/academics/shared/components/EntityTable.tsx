import type { ReactNode } from "react";

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

export function EntityTable<T>({ columns, rows, getRowId, emptyText, actions }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[760px] text-left text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={["px-4 py-3 font-black", column.className].join(" ")}>{column.header}</th>
            ))}
            {actions && <th className="px-4 py-3 text-right font-black">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowId(row)} className="border-t border-slate-100">
              {columns.map((column) => (
                <td key={column.key} className={["px-4 py-4 font-semibold text-slate-600", column.className].join(" ")}>{column.render(row)}</td>
              ))}
              {actions && <td className="px-4 py-4">{actions(row)}</td>}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
