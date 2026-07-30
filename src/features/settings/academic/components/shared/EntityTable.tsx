import type { ReactNode } from "react";

export function EntityTable({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "w-full min-w-0 overflow-hidden",
        "rounded-[18px]",
        "border border-border/60",
        "bg-card",
        "shadow-[0_8px_24px_rgba(30,20,70,0.035)]",
      ].join(" ")}
    >
      <table
        className={[
          "w-full table-fixed border-collapse text-left",
          "text-[12px]",
          "[&_tbody_tr]:transition-colors",
          "[&_tbody_tr]:duration-150",
          "[&_tbody_tr:hover]:bg-primary/[0.025]",
          "[&_tbody_tr:last-child_td]:border-b-0",
        ].join(" ")}
      >
        {children}
      </table>
    </div>
  );
}

export function EntityTh({
  children,
  align,
}: {
  children: ReactNode;
  align?: "right" | "center";
}) {
  return (
    <th
      scope="col"
      className={[
        "border-b border-border/55",
        "bg-muted/25 px-3 py-3",
        "text-[9px] font-semibold",
        "uppercase tracking-[0.07em]",
        "text-muted-foreground",
        "whitespace-normal break-words leading-4",
        align === "right" ? "text-right" : "",
        align === "center" ? "text-center" : "",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

export function EntityTd({
  children,
  strong,
  align,
}: {
  children: ReactNode;
  strong?: boolean;
  align?: "right" | "center";
}) {
  return (
    <td
      className={[
        "min-w-0 border-b border-border/40",
        "px-3 py-3 align-middle",
        "text-[12px] leading-5",
        "whitespace-normal break-words",
        strong
          ? "font-medium text-foreground"
          : "font-normal text-muted-foreground",
        align === "right" ? "text-right" : "",
        align === "center" ? "text-center" : "",
      ].join(" ")}
    >
      {children}
    </td>
  );
}
