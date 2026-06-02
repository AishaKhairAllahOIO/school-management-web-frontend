import {
  Box,
  ChevronRight,
  Download,
  LayoutGrid,
  LockKeyhole,
  Settings,
  Shield,
  Users,
  BookOpen,
  CalendarCheck,
  Wallet,
  BarChart3,
  Cog,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

const stats = [
  {
    label: "Total Permissions",
    value: "28",
    description: "All system permissions",
    icon: LayoutGrid,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Module Access",
    value: "14",
    description: "Accessible modules",
    icon: Box,
    color: "bg-info/10 text-info",
  },
  {
    label: "Full Access",
    value: "12",
    description: "Full control permissions",
    icon: Shield,
    color: "bg-success/10 text-success",
  },
  {
    label: "Restricted",
    value: "2",
    description: "Limited access permissions",
    icon: LockKeyhole,
    color: "bg-warning/10 text-warning",
  },
];

const modules = [
  {
    name: "Users",
    description: "Manage students, teachers, parents and staff",
    permissions: 6,
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Academic",
    description: "Manage classes, sections, subjects and curriculum",
    permissions: 5,
    icon: BookOpen,
    color: "bg-info/10 text-info",
  },
  {
    name: "Attendance",
    description: "Track attendance for students and staff",
    permissions: 4,
    icon: CalendarCheck,
    color: "bg-success/10 text-success",
  },
  {
    name: "Finance",
    description: "Manage fees, payments and salaries",
    permissions: 5,
    icon: Wallet,
    color: "bg-warning/10 text-warning",
  },
  {
    name: "Reports",
    description: "View and generate system reports",
    permissions: 4,
    icon: BarChart3,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Settings",
    description: "System settings and configurations",
    permissions: 4,
    icon: Cog,
    color: "bg-info/10 text-info",
  },
];

const matrix = [
  ["Users", "Full Access", "Full Access", "Full Access"],
  ["Academic", "Full Access", "Full Access", "Limited Access"],
  ["Attendance", "Full Access", "Full Access", "Full Access"],
  ["Finance", "Full Access", "Full Access", "No Access"],
  ["Reports", "Full Access", "Limited Access", "Limited Access"],
  ["Settings", "Full Access", "No Access", "No Access"],
];

function AccessBadge({ value }: { value: string }) {
  const className =
    value === "Full Access"
      ? "bg-success/10 text-success"
      : value === "Limited Access"
        ? "bg-warning/10 text-warning"
        : "bg-destructive/10 text-destructive";

  return (
    <span
      className={`inline-flex min-w-[86px] justify-center rounded-full px-3 py-1 text-[11px] font-bold ${className}`}
    >
      {value}
    </span>
  );
}

export function PermissionsPage() {
  return (
    <div className="soft-card rounded-3xl p-6">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-foreground">
            Permissions
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage and configure permissions for each role in the system.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-2xl border border-border/70 bg-card px-4 text-sm font-bold text-foreground transition hover:bg-muted"
          >
            <Download size={16} />
            Export
          </button>

          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
          >
            <Settings size={16} />
            Manage Modules
          </button>
        </div>
      </div>

      <section className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-3xl border border-border/70 bg-card p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Icon size={25} strokeWidth={1.9} />
                </span>

                <div className="h-9 w-16 rounded-full bg-primary/5" />
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>

                <h3 className="mt-1 text-[2rem] font-bold leading-none tracking-[-0.04em] text-foreground">
                  {item.value}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-border/70 bg-card">
          <div className="border-b border-border/70 p-5">
            <h2 className="text-base font-bold text-foreground">
              System Modules & Permissions
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage permissions for each module in the system
            </p>
          </div>

          <div className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground">
                  <th className="px-5 py-4">Module</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4 text-center">Total Permissions</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody>
                {modules.map((item) => {
                  const Icon = item.icon;

                  return (
                    <tr
                      key={item.name}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.color}`}
                          >
                            <Icon size={18} />
                          </span>

                          <span className="text-sm font-bold text-foreground">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {item.description}
                      </td>

                      <td className="px-5 py-4 text-center text-sm font-semibold text-foreground">
                        {item.permissions}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                          Active
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <ChevronRight
                          size={17}
                          className="text-muted-foreground"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border/70 p-5">
            <p className="text-sm text-muted-foreground">
              Showing 1 to 6 of 6 modules
            </p>

            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground">
                <ChevronLeft size={15} />
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                1
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 text-muted-foreground">
                <ChevronRight size={15} />
              </button>
            </div>

            <button className="flex h-9 items-center gap-2 rounded-xl border border-border/70 px-3 text-sm font-semibold text-foreground">
              10 per page
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card">
          <div className="border-b border-border/70 p-5">
            <h2 className="text-base font-bold text-foreground">
              Role Permissions Matrix
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Overview of permissions by role
            </p>
          </div>

          <div className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground">
                  <th className="px-5 py-4">Module</th>
                  <th className="px-4 py-4 text-center">Super Admin</th>
                  <th className="px-4 py-4 text-center">Secretary</th>
                  <th className="px-4 py-4 text-center">Supervisor</th>
                </tr>
              </thead>

              <tbody>
                {matrix.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-5 py-5 text-sm font-bold text-foreground">
                      {row[0]}
                    </td>

                    <td className="px-4 py-5 text-center">
                      <AccessBadge value={row[1]} />
                    </td>

                    <td className="px-4 py-5 text-center">
                      <AccessBadge value={row[2]} />
                    </td>

                    <td className="px-4 py-5 text-center">
                      <AccessBadge value={row[3]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-5 border-t border-border/70 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-success" />
              Full Access
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-warning" />
              Limited Access
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-destructive" />
              No Access
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}