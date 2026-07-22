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
    <div className="grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
      <aside
        className={[
          "overflow-hidden rounded-[26px]",
          "border border-border/60",
          "bg-card",
          "shadow-[0_12px_40px_rgba(30,20,70,0.055)]",
          "lg:sticky lg:top-6",
        ].join(" ")}
      >
        <div className="px-5 pb-3 pt-5">
          <h2 className="text-sm font-semibold text-foreground">
            Academic Management
          </h2>

          <p className="mt-1 text-xs font-normal leading-5 text-muted-foreground">
            Choose an area to manage.
          </p>
        </div>

        <div className="px-3 pb-3">
          {items.map((item, index) => {
            const active = item.id === activeId;

            return (
              <div
                key={item.id}
                className={
                  index > 0
                    ? "border-t border-border/45"
                    : ""
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    onChange(item.id)
                  }
                  aria-current={
                    active ? "page" : undefined
                  }
                  className={[
                    "group my-1 flex w-full items-start gap-3.5",
                    "rounded-[18px] px-4 py-4 text-left",
                    "transition-all duration-200",
                    "focus-visible:outline-none",
                    "focus-visible:ring-4",
                    "focus-visible:ring-primary/10",
                    active
                      ? [
                          "bg-primary/[0.075]",
                          "text-primary",
                          "shadow-[0_6px_18px_rgba(95,55,220,0.07)]",
                        ].join(" ")
                      : [
                          "text-muted-foreground",
                          "hover:bg-muted/45",
                          "hover:text-foreground",
                        ].join(" "),
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mt-0.5 flex h-9 w-9 shrink-0",
                      "items-center justify-center rounded-xl",
                      "transition-colors duration-200",
                      active
                        ? "bg-primary/10 text-primary"
                        : [
                            "bg-muted/55",
                            "text-muted-foreground",
                            "group-hover:text-foreground",
                          ].join(" "),
                    ].join(" ")}
                  >
                    {item.icon}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={[
                        "block truncate text-[13px]",
                        "font-medium leading-5",
                        active
                          ? "text-primary"
                          : "text-foreground",
                      ].join(" ")}
                    >
                      {item.title}
                    </span>

                    <span className="mt-0.5 block text-[11px] font-normal leading-4 text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {hint ? (
          <div className="border-t border-border/50 p-4">
            <div className="rounded-[18px] bg-primary/[0.055] px-4 py-4">
              <p className="text-[11px] font-normal leading-5 text-primary">
                {hint}
              </p>
            </div>
          </div>
        ) : null}
      </aside>

      <main
        className={[
          "min-w-0 rounded-[26px]",
          "border border-border/60",
          "bg-card p-5",
          "shadow-[0_12px_40px_rgba(30,20,70,0.055)]",
          "sm:p-6",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
}