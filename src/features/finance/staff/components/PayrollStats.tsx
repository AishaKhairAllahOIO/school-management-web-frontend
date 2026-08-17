import type { LucideIcon } from "lucide-react";

type Stat = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

export function PayrollStats({
  items,
}: {
  items: Stat[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="
              soft-card rounded-2xl p-4
              transition-shadow
              hover:shadow-soft
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {item.value}
                </p>
              </div>

              <div
                className="
                  flex size-9 items-center justify-center
                  rounded-xl bg-primary/10 text-primary
                "
              >
                <Icon className="size-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}