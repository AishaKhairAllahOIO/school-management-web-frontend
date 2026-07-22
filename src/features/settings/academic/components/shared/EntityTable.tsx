import type { ReactNode } from "react";

export function EntityTable({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "w-full overflow-hidden",
        "rounded-[20px]",
        "border border-border/65",
        "bg-card",
      ].join(" ")}
    >
      <div className="w-full overflow-x-auto">
        <table
          className={[
            "w-full min-w-[860px]",
            "border-collapse text-left",
            "text-[13px]",
            "[&_tbody_tr]:transition-colors",
            "[&_tbody_tr]:duration-150",
            "[&_tbody_tr:hover]:bg-primary/[0.025]",
          ].join(" ")}
        >
          {children}
        </table>
      </div>
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
        "whitespace-nowrap",
        "border-b border-border/60",
        "bg-muted/35 px-5 py-4",
        "text-[10px] font-semibold",
        "uppercase tracking-[0.08em]",
        "text-muted-foreground",
        align === "right"
          ? "text-right"
          : "",
        align === "center"
          ? "text-center"
          : "",
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
        "border-b border-border/45",
        "px-5 py-[18px]",
        "text-[13px] leading-5",
        strong
          ? "font-medium text-foreground"
          : "font-normal text-muted-foreground",
        align === "right"
          ? "text-right"
          : "",
        align === "center"
          ? "text-center"
          : "",
      ].join(" ")}
    >
      {children}
    </td>
  );
}