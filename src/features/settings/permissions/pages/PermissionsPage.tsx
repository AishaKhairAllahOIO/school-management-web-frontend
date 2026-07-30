import {
  BarChart3,
  BookOpen,
  Box,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Cog,
  LayoutGrid,
  LockKeyhole,
  MessageCircle,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

const stats = [
  {
    label: "Total Permissions",
    value: "41",
    description: "All permission actions",
    icon: LayoutGrid,
    color: "bg-primary/[0.09] text-primary",
  },
  {
    label: "System Modules",
    value: "8",
    description: "Sidebar-aligned modules",
    icon: Box,
    color: "bg-info/[0.09] text-info",
  },
  {
    label: "Full Access",
    value: "31",
    description: "Fully granted actions",
    icon: Shield,
    color: "bg-success/[0.09] text-success",
  },
  {
    label: "Restricted",
    value: "10",
    description: "Limited or blocked actions",
    icon: LockKeyhole,
    color: "bg-warning/[0.09] text-warning",
  },
];

const modules = [
  {
    name: "Users",
    description: "Students, teachers, parents and staff",
    permissions: 6,
    icon: Users,
    color: "bg-primary/[0.09] text-primary",
  },
  {
    name: "Academics",
    description: "Years, terms, stages, subjects and grades",
    permissions: 7,
    icon: BookOpen,
    color: "bg-info/[0.09] text-info",
  },
  {
    name: "Attendance",
    description: "Student and staff attendance records",
    permissions: 4,
    icon: CalendarCheck,
    color: "bg-success/[0.09] text-success",
  },
  {
    name: "Scheduling",
    description: "Timetables, periods and school schedules",
    permissions: 5,
    icon: CalendarDays,
    color: "bg-primary/[0.09] text-primary",
  },
  {
    name: "Finance",
    description: "Fees, payments, expenses and salaries",
    permissions: 5,
    icon: Wallet,
    color: "bg-warning/[0.09] text-warning",
  },
  {
    name: "Communications",
    description: "Announcements, messages and notifications",
    permissions: 4,
    icon: MessageCircle,
    color: "bg-info/[0.09] text-info",
  },
  {
    name: "Reports",
    description: "Operational reports and analytics",
    permissions: 4,
    icon: BarChart3,
    color: "bg-success/[0.09] text-success",
  },
  {
    name: "Settings",
    description: "General, academic, roles and permissions settings",
    permissions: 6,
    icon: Cog,
    color: "bg-primary/[0.09] text-primary",
  },
];

const matrix = [
  ["Users", "Full Access", "Full Access", "Limited Access"],
  ["Academics", "Full Access", "Limited Access", "Full Access"],
  ["Attendance", "Full Access", "Limited Access", "Full Access"],
  ["Scheduling", "Full Access", "Limited Access", "Limited Access"],
  ["Finance", "Full Access", "Full Access", "No Access"],
  ["Communications", "Full Access", "Full Access", "Limited Access"],
  ["Reports", "Full Access", "Limited Access", "Limited Access"],
  ["Settings", "Full Access", "No Access", "No Access"],
];

function AccessBadge({
  value,
}: {
  value: string;
}) {
  const className =
    value === "Full Access"
      ? "bg-success/[0.09] text-success"
      : value === "Limited Access"
        ? "bg-warning/[0.09] text-warning"
        : "bg-destructive/[0.08] text-destructive";

  return (
    <span
      className={[
        "inline-flex justify-center",
        "rounded-full px-2.5 py-1",
        "text-[9px] font-medium",
        "whitespace-nowrap",
        className,
      ].join(" ")}
    >
      {value}
    </span>
  );
}

export function PermissionsPage() {
  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className={[
                "rounded-[22px]",
                "border border-border/45",
                "bg-card p-4",
                "shadow-[0_8px_28px_rgba(30,20,70,0.03)]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={[
                    "flex h-10 w-10",
                    "items-center justify-center",
                    "rounded-[14px]",
                    item.color,
                  ].join(" ")}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </span>

                <span className="rounded-full bg-muted/[0.35] px-2.5 py-1 text-[9px] font-medium text-muted-foreground">
                  Overview
                </span>
              </div>

              <p className="mt-4 text-[11px] font-medium text-muted-foreground">
                {item.label}
              </p>

              <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-foreground">
                {item.value}
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                {item.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1.12fr)_minmax(430px,0.88fr)]">
        <article className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
          <header className="border-b border-border/45 px-5 py-4">
            <h2 className="text-[14px] font-semibold text-foreground">
              System Modules
            </h2>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Modules match the main sidebar. Dashboard is role-specific and is not treated as a permission module.
            </p>
          </header>

          <div className="hidden lg:block">
            <table className="w-full table-fixed text-left">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[39%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[8%]" />
              </colgroup>

              <thead>
                <tr className="border-b border-border/45 bg-muted/[0.12] text-[10px] font-medium text-muted-foreground">
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-3 py-3 text-center">Permissions</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>

              <tbody>
                {modules.map((item) => {
                  const Icon = item.icon;

                  return (
                    <tr
                      key={item.name}
                      className="border-b border-border/40 last:border-0 transition hover:bg-muted/[0.10]"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className={[
                              "flex h-9 w-9 shrink-0",
                              "items-center justify-center",
                              "rounded-[12px]",
                              item.color,
                            ].join(" ")}
                          >
                            <Icon size={16} strokeWidth={1.8} />
                          </span>

                          <span className="truncate text-[11px] font-semibold text-foreground">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                          {item.description}
                        </p>
                      </td>

                      <td className="px-3 py-3.5 text-center text-[11px] font-semibold text-foreground">
                        {item.permissions}
                      </td>

                      <td className="px-3 py-3.5 text-center">
                        <span className="rounded-full bg-success/[0.09] px-2.5 py-1 text-[9px] font-medium text-success">
                          Active
                        </span>
                      </td>

                      <td className="px-2 py-3.5 text-right">
                        <button
                          type="button"
                          aria-label={`View ${item.name} permissions`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted/45 hover:text-foreground"
                        >
                          <ChevronRight size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-2 p-3 lg:hidden">
            {modules.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.name}
                  className="rounded-[17px] border border-border/45 bg-muted/[0.08] p-3"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0",
                        "items-center justify-center",
                        "rounded-[12px]",
                        item.color,
                      ].join(" ")}
                    >
                      <Icon size={16} strokeWidth={1.8} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-[11px] font-semibold text-foreground">
                          {item.name}
                        </h3>

                        <span className="rounded-full bg-success/[0.09] px-2.5 py-1 text-[9px] font-medium text-success">
                          Active
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          Permissions
                        </span>

                        <span className="text-[11px] font-semibold text-foreground">
                          {item.permissions}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/45 px-5 py-3.5">
            <p className="text-[10px] text-muted-foreground">
              Showing 8 of 8 modules
            </p>

            <span className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-[10px] font-medium text-foreground/75">
              8 modules
            </span>
          </footer>
        </article>

        <article className="overflow-hidden rounded-[24px] border border-border/45 bg-card shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
          <header className="border-b border-border/45 px-5 py-4">
            <h2 className="text-[14px] font-semibold text-foreground">
              Role Permissions Matrix
            </h2>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Access comparison by role.
            </p>
          </header>

          <div className="hidden xl:block">
            <table className="w-full table-fixed text-left">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[25%]" />
                <col className="w-[25%]" />
                <col className="w-[25%]" />
              </colgroup>

              <thead>
                <tr className="border-b border-border/45 bg-muted/[0.12] text-[10px] font-medium text-muted-foreground">
                  <th className="px-3 py-3">Module</th>
                  <th className="px-2 py-3 text-center">Super Admin</th>
                  <th className="px-2 py-3 text-center">Secretary</th>
                  <th className="px-2 py-3 text-center">Supervisor</th>
                </tr>
              </thead>

              <tbody>
                {matrix.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-b border-border/40 last:border-0"
                  >
                    <td className="px-3 py-3.5 text-[11px] font-semibold text-foreground">
                      {row[0]}
                    </td>

                    <td className="px-2 py-3.5 text-center">
                      <AccessBadge value={row[1]} />
                    </td>

                    <td className="px-2 py-3.5 text-center">
                      <AccessBadge value={row[2]} />
                    </td>

                    <td className="px-2 py-3.5 text-center">
                      <AccessBadge value={row[3]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-2 p-3 xl:hidden">
            {matrix.map((row) => (
              <article
                key={row[0]}
                className="rounded-[17px] border border-border/45 bg-muted/[0.08] p-3"
              >
                <h3 className="text-[11px] font-semibold text-foreground">
                  {row[0]}
                </h3>

                <div className="mt-3 grid gap-2">
                  {[
                    ["Super Admin", row[1]],
                    ["Secretary", row[2]],
                    ["Supervisor", row[3]],
                  ].map(([role, access]) => (
                    <div
                      key={role}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-[10px] text-muted-foreground">
                        {role}
                      </span>

                      <AccessBadge value={access} />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/45 px-5 py-3.5">
            {[
              {
                label: "Full Access",
                className: "bg-success",
              },
              {
                label: "Limited Access",
                className: "bg-warning",
              },
              {
                label: "No Access",
                className: "bg-destructive",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-[10px] text-muted-foreground"
              >
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    item.className,
                  ].join(" ")}
                />
                {item.label}
              </div>
            ))}
          </footer>
        </article>
      </section>
    </div>
  );
}
