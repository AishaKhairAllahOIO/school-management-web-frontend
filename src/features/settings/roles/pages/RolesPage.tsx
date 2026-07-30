import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Crown,
  Edit3,
  HelpCircle,
  LayoutGrid,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";

const roles = [
  {
    id: "super-admin",
    name: "Super Admin",
    users: 2,
    description: "Full system access and control.",
    status: "Active",
    icon: Crown,
    color: "text-primary bg-primary/[0.09]",
  },
  {
    id: "secretary",
    name: "Secretary",
    users: 6,
    description: "Handles administrative tasks and data entry.",
    status: "Active",
    icon: UserCog,
    color: "text-info bg-info/[0.09]",
  },
  {
    id: "supervisor",
    name: "Supervisor",
    users: 4,
    description: "Monitors students and academic performance.",
    status: "Active",
    icon: Users,
    color: "text-success bg-success/[0.09]",
  },
];

const permissionsSummary = [
  {
    label: "Total Permissions",
    value: 41,
    icon: LayoutGrid,
    color: "text-primary bg-primary/[0.09]",
  },
  {
    label: "System Modules",
    value: 8,
    icon: BookOpen,
    color: "text-info bg-info/[0.09]",
  },
  {
    label: "Full Access",
    value: 31,
    icon: ShieldCheck,
    color: "text-success bg-success/[0.09]",
  },
  {
    label: "Restricted",
    value: 10,
    icon: LockKeyhole,
    color: "text-warning bg-warning/[0.09]",
  },
];

const moduleAccess = [
  {
    title: "Users",
    icon: Users,
    color: "text-primary bg-primary/[0.09]",
  },
  {
    title: "Academics",
    icon: BookOpen,
    color: "text-info bg-info/[0.09]",
  },
  {
    title: "Attendance",
    icon: CalendarCheck,
    color: "text-success bg-success/[0.09]",
  },
  {
    title: "Scheduling",
    icon: CalendarDays,
    color: "text-primary bg-primary/[0.09]",
  },
  {
    title: "Finance",
    icon: Wallet,
    color: "text-warning bg-warning/[0.09]",
  },
  {
    title: "Communications",
    icon: MessageCircle,
    color: "text-info bg-info/[0.09]",
  },
  {
    title: "Reports",
    icon: BarChart3,
    color: "text-success bg-success/[0.09]",
  },
  {
    title: "Settings",
    icon: Settings,
    color: "text-primary bg-primary/[0.09]",
  },
];

const roleInformation = {
  "super-admin": {
    description:
      "Has complete access to all modules, users, roles, permissions and system configuration.",
    createdAt: "May 15, 2024",
    updatedAt: "May 20, 2025",
  },
  secretary: {
    description:
      "Can manage day-to-day administrative records, student files and routine data entry.",
    createdAt: "June 02, 2024",
    updatedAt: "April 18, 2025",
  },
  supervisor: {
    description:
      "Can review student progress, attendance records and academic performance reports.",
    createdAt: "June 11, 2024",
    updatedAt: "May 03, 2025",
  },
} as const;

export function RolesPage() {
  const [selectedRoleId, setSelectedRoleId] =
    useState(roles[0].id);

  const selectedRole =
    roles.find((role) => role.id === selectedRoleId) ?? roles[0];

  const SelectedIcon = selectedRole.icon;

  const selectedInformation =
    roleInformation[
      selectedRole.id as keyof typeof roleInformation
    ];

  return (
    <div className="space-y-5">
      <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <section className="rounded-[24px] border border-border/45 bg-card p-3 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
            <div className="space-y-2">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = role.id === selectedRole.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRoleId(role.id)}
                    className={[
                      "group w-full rounded-[18px]",
                      "border px-3.5 py-3",
                      "text-left transition duration-200",
                      isActive
                        ? "border-primary/20 bg-primary/[0.055]"
                        : "border-transparent hover:border-border/55 hover:bg-muted/[0.22]",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0",
                          "items-center justify-center",
                          "rounded-[14px]",
                          role.color,
                        ].join(" ")}
                      >
                        <Icon size={18} strokeWidth={1.8} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-[13px] font-semibold text-foreground">
                            {role.name}
                          </h3>

                          <span className="rounded-full bg-success/[0.09] px-2 py-0.5 text-[9px] font-medium text-success">
                            {role.status}
                          </span>
                        </div>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {role.users} users
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className={[
                          "shrink-0",
                          "text-muted-foreground/60",
                          "transition-transform",
                          isActive
                            ? "translate-x-0.5 text-primary"
                            : "group-hover:translate-x-0.5",
                        ].join(" ")}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[22px] border border-primary/12 bg-primary/[0.035] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-primary/[0.09] text-primary">
                <HelpCircle size={17} strokeWidth={1.8} />
              </span>

              <div>
                <p className="text-[12px] font-semibold text-foreground">
                  Role management
                </p>

                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  Dashboard is selected by role and is not counted as a separate module.
                </p>
              </div>
            </div>
          </section>
        </aside>

        <section className="rounded-[26px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)] sm:p-6">
          <div className="flex flex-col gap-5 border-b border-border/45 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span
                className={[
                  "flex h-14 w-14 shrink-0",
                  "items-center justify-center",
                  "rounded-[18px]",
                  selectedRole.color,
                ].join(" ")}
              >
                <SelectedIcon size={25} strokeWidth={1.75} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-foreground">
                    {selectedRole.name}
                  </h2>

                  <span className="rounded-full bg-success/[0.09] px-2.5 py-1 text-[10px] font-medium text-success">
                    {selectedRole.status}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-muted-foreground">
                  {selectedRole.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start">
              <button
                type="button"
                className="flex h-9 items-center gap-2 rounded-full border border-border/65 bg-background px-4 text-[11px] font-medium text-foreground/80 transition hover:bg-muted/45 hover:text-foreground"
              >
                <Edit3 size={14} />
                Edit Role
              </button>

              <button
                type="button"
                aria-label="More actions"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/65 bg-background text-muted-foreground transition hover:bg-muted/45 hover:text-foreground"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
            <article className="rounded-[20px] border border-border/50 bg-muted/[0.12] p-4.5">
              <h3 className="text-[13px] font-semibold text-foreground">
                Role Information
              </h3>

              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-medium text-muted-foreground">
                    Role Name
                  </dt>
                  <dd className="mt-1 text-[12px] font-medium text-foreground">
                    {selectedRole.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-[10px] font-medium text-muted-foreground">
                    Assigned Users
                  </dt>
                  <dd className="mt-1 text-[12px] font-medium text-foreground">
                    {selectedRole.users}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-medium text-muted-foreground">
                    Description
                  </dt>
                  <dd className="mt-1 max-w-2xl text-[12px] leading-5 text-foreground/85">
                    {selectedInformation.description}
                  </dd>
                </div>

                <div>
                  <dt className="text-[10px] font-medium text-muted-foreground">
                    Created At
                  </dt>
                  <dd className="mt-1 text-[12px] font-medium text-foreground">
                    {selectedInformation.createdAt}
                  </dd>
                </div>

                <div>
                  <dt className="text-[10px] font-medium text-muted-foreground">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-[12px] font-medium text-foreground">
                    {selectedInformation.updatedAt}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="rounded-[20px] border border-border/50 bg-muted/[0.12] p-4.5">
              <h3 className="text-[13px] font-semibold text-foreground">
                Permissions Summary
              </h3>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                {permissionsSummary.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 rounded-[15px] border border-border/45 bg-card px-3 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={[
                            "flex h-8 w-8 shrink-0",
                            "items-center justify-center",
                            "rounded-[11px]",
                            item.color,
                          ].join(" ")}
                        >
                          <Icon size={15} strokeWidth={1.8} />
                        </span>

                        <span className="truncate text-[11px] text-muted-foreground">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-[12px] font-semibold text-foreground">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <article className="mt-4 rounded-[20px] border border-border/50 bg-muted/[0.12] p-4.5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[13px] font-semibold text-foreground">
                Module Access
              </h3>

              <span className="text-[10px] text-muted-foreground">
                8 modules
              </span>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {moduleAccess.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-[16px] border border-border/50 bg-card px-3 py-3 transition hover:border-primary/15 hover:shadow-[0_8px_22px_rgba(30,20,70,0.045)]"
                  >
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

                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-foreground">
                        {item.title}
                      </p>

                      <p className="mt-0.5 text-[9px] font-medium text-success">
                        Full Access
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
