import type { ReactNode } from "react";

type WorkspaceNavItem = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
};

type Props = {
  items: WorkspaceNavItem[];
  activeId: string;
  onChange: (id: string) => void;
  children: ReactNode;
  hint?: string;
};

export function SettingsWorkspace({
  items,
  activeId,
  onChange,
  children,
  hint,
}: Props) {
  return (
    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside
        className={[
          "overflow-hidden rounded-[20px]",
          "border border-border/55 bg-card",
          "shadow-[0_8px_26px_rgba(30,20,70,0.04)]",
        ].join(" ")}
      >
        <div className="p-2">
          {items.map((item) => {
            const active = item.id === activeId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                aria-current={active ? "page" : undefined}
                className={[
                  "group flex w-full items-center gap-2.5",
                  "rounded-[14px] px-3 py-2.5 text-left",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-4",
                  "focus-visible:ring-primary/10",
                  active
                    ? "bg-primary/[0.07] text-primary"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center",
                    "rounded-[11px] transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "bg-muted/45 text-muted-foreground group-hover:text-foreground",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-foreground">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] leading-4 text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {hint ? (
          <div className="border-t border-border/40 p-2.5">
            <div className="rounded-[13px] bg-primary/[0.04] px-3 py-2.5">
              <p className="text-[11px] leading-4 text-muted-foreground">
                {hint}
              </p>
            </div>
          </div>
        ) : null}
      </aside>

      <main
        className={[
          "min-w-0 overflow-hidden rounded-[20px]",
          "border border-border/55 bg-card p-4",
          "shadow-[0_8px_26px_rgba(30,20,70,0.04)]",
          "sm:p-5",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
}
