import {
  BookOpen,
  Crown,
  Edit3,
  LayoutGrid,
  LockKeyhole,
  MoreVertical,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  BarChart3,
  CalendarCheck,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  UserCog,
} from "lucide-react";

const roles = [
  {
    id: "super-admin",
    name: "Super Admin",
    users: 2,
    description: "Full system access and control",
    status: "Active",
    icon: Crown,
    color: "text-primary bg-primary/10",
  },
  {
    id: "secretary",
    name: "Secretary",
    users: 6,
    description: "Handles administrative tasks and data entry",
    status: "Active",
    icon: UserCog,
    color: "text-info bg-info/10",
  },
  {
    id: "supervisor",
    name: "Supervisor",
    users: 4,
    description: "Monitors students and academic performance",
    status: "Active",
    icon: Users,
    color: "text-success bg-success/10",
  },
];

const permissionsSummary = [
  { label: "Total Permissions", value: 28, icon: LayoutGrid, color: "text-primary bg-primary/10" },
  { label: "Module Access", value: 14, icon: BookOpen, color: "text-info bg-info/10" },
  { label: "Full Access", value: 12, icon: ShieldCheck, color: "text-success bg-success/10" },
  { label: "Restricted", value: 2, icon: LockKeyhole, color: "text-warning bg-warning/10" },
];

const moduleAccess = [
  { title: "Users", icon: Users, color: "text-primary bg-primary/10" },
  { title: "Academic", icon: BookOpen, color: "text-info bg-info/10" },
  { title: "Attendance", icon: CalendarCheck, color: "text-success bg-success/10" },
  { title: "Finance", icon: Wallet, color: "text-warning bg-warning/10" },
  { title: "Reports", icon: BarChart3, color: "text-primary bg-primary/10" },
  { title: "Settings", icon: Settings, color: "text-info bg-info/10" },
];

export function RolesPage() {
  const selectedRole = roles[0];
  const SelectedIcon = selectedRole.icon;

  return (
    <div className="soft-card rounded-3xl p-6">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">
            Roles
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage user roles and their access levels
          </p>
        </div>

        <button
          type="button"
          className="flex h-11 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
        >
          <span className="text-xl leading-none">+</span>
          Create Role
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[350px_1fr]">
        <aside className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const active = role.id === selectedRole.id;

            return (
              <button
                key={role.id}
                type="button"
                className={[
                  "w-full rounded-3xl border p-4 text-left transition",
                  active
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-border/70 bg-card hover:bg-muted/40",
                ].join(" ")}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${role.color}`}
                  >
                    <Icon size={24} strokeWidth={1.9} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-bold text-foreground">
                        {role.name}
                      </h3>

                      <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
                        {role.status}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {role.users} Users
                    </p>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {role.description}
                    </p>
                  </div>

                  <ChevronRight size={18} className="text-muted-foreground" />
                </div>
              </button>
            );
          })}

          <div className="rounded-3xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HelpCircle size={20} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primary">Need help?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Learn more about roles and permissions
                </p>
              </div>

              <ExternalLink size={15} className="text-primary" />
            </div>
          </div>
        </aside>

        <section className="rounded-3xl border border-border/70 bg-card p-6">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SelectedIcon size={36} strokeWidth={1.8} />
              </span>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-[-0.04em] text-foreground">
                    Super Admin
                  </h2>

                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                    Active
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Full system access and control
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-2xl border border-border/70 bg-card px-4 text-xs font-bold text-foreground transition hover:bg-muted"
              >
                <Edit3 size={15} />
                Edit Role
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <MoreVertical size={17} />
              </button>
            </div>
          </div>

          <div className="mb-5 flex border-b border-border/70">
            {["Overview", "Permissions (28)", "Users (2)"].map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={[
                  "relative px-5 pb-3 text-sm font-semibold transition",
                  index === 0
                    ? "text-primary after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-primary"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.85fr]">
            <div className="rounded-3xl border border-border/70 bg-background/40 p-5">
              <h3 className="mb-5 text-sm font-bold text-foreground">
                Role Information
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Role Name
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    Super Admin
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-1 max-w-[520px] leading-6 text-foreground">
                    Has full access to all modules and settings. Can manage users,
                    roles, permissions, and system configurations.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    May 15, 2024
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    May 20, 2025
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-background/40 p-5">
              <h3 className="mb-5 text-sm font-bold text-foreground">
                Permissions Summary
              </h3>

              <div className="space-y-4">
                {permissionsSummary.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.color}`}
                        >
                          <Icon size={18} />
                        </span>

                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-sm font-bold text-foreground">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-border/70 bg-background/40 p-5">
            <h3 className="mb-5 text-sm font-bold text-foreground">
              Module Access
            </h3>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {moduleAccess.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3"
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.color}`}
                    >
                      <Icon size={20} />
                    </span>

                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-success">
                        Full Access
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}