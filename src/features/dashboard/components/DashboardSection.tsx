
type Props = {
  title: string;
  description?: string;
  action?: string;
  children: React.ReactNode;
  className?: string;
};

export function DashboardSection({
  title,
  description,
  action,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={[
        "rounded-[30px] border border-border/50 bg-card/95 p-5",
        "shadow-[0_12px_35px_rgba(40,25,90,0.045)]",
        className,
      ].join(" ")}
    >
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <button className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary">
            {action}
          </button>
        ) : null}
      </header>

      {children}
    </section>
  );
}
