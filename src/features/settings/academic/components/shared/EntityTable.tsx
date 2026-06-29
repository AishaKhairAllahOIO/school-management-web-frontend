import type { ReactNode } from "react";

export function EntityTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function EntityTh({ children, align }: { children: ReactNode; align?: "right" | "center" }) {
  return (
    <th
      className={[
        "bg-slate-50 px-5 py-4 text-xs font-black text-slate-500",
        align === "right" ? "text-right" : "",
        align === "center" ? "text-center" : "",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

export function EntityTd({ children, strong, align }: { children: ReactNode; strong?: boolean; align?: "right" | "center" }) {
  return (
    <td
      className={[
        "border-t border-slate-100 px-5 py-4 text-sm text-slate-600",
        strong ? "font-black text-slate-900" : "font-semibold",
        align === "right" ? "text-right" : "",
        align === "center" ? "text-center" : "",
      ].join(" ")}
    >
      {children}
    </td>
  );
}
