import type { LucideIcon } from "lucide-react";

type SummaryItem = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "destructive" | "info";
};

type Props = {
  items: SummaryItem[];
};

const tones = {
  primary: {
    shell: "border-primary/14 bg-primary/[0.035]",
    icon: "bg-primary/[0.09] text-primary",
    value: "text-primary",
  },
  success: {
    shell: "border-success/14 bg-success/[0.035]",
    icon: "bg-success/[0.09] text-success",
    value: "text-success",
  },
  warning: {
    shell: "border-warning/16 bg-warning/[0.04]",
    icon: "bg-warning/[0.1] text-warning",
    value: "text-warning",
  },
  destructive: {
    shell: "border-destructive/14 bg-destructive/[0.035]",
    icon: "bg-destructive/[0.085] text-destructive",
    value: "text-destructive",
  },
  info: {
    shell: "border-info/14 bg-info/[0.035]",
    icon: "bg-info/[0.09] text-info",
    value: "text-info",
  },
} as const;

export function FinanceSummaryGrid({ items }: Props) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const tone = tones[item.tone ?? "primary"];
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className={[
              "relative overflow-hidden rounded-[18px] border px-4 py-3.5",
              "shadow-[0_8px_24px_rgba(38,24,84,0.035)]",
              tone.shell,
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px]",
                  tone.icon,
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-normal text-muted-foreground/80">
                  {item.label}
                </p>
                <p
                  className={[
                    "mt-0.5 truncate text-[20px] font-semibold leading-6 tracking-[-0.025em]",
                    tone.value,
                  ].join(" ")}
                >
                  {item.value}
                </p>
                {item.hint ? (
                  <p className="mt-0.5 truncate text-[10.5px] font-normal text-muted-foreground/65">
                    {item.hint}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
