import {
  Users,
  WalletCards,
  Settings,
  FileText,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  CalendarDays,
  Globe2,
  UserPlus,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type QuickActionRole =
  | "super-admin"
  | "adviser"
  | "secretary";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  path?: string;
  external?: boolean;
  color:
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "destructive";
}

interface QuickActionsProps {
  role: QuickActionRole;
}

const colorMap = {
  primary: {
    icon: "bg-primary/[0.08] text-primary",
    hover: "hover:bg-primary/[0.06]",
  },

  info: {
    icon: "bg-info/[0.08] text-info",
    hover: "hover:bg-info/[0.06]",
  },

  success: {
    icon: "bg-success/[0.08] text-success",
    hover: "hover:bg-success/[0.06]",
  },

  warning: {
    icon: "bg-warning/[0.08] text-warning",
    hover: "hover:bg-warning/[0.06]",
  },

  destructive: {
    icon: "bg-destructive/[0.08] text-destructive",
    hover: "hover:bg-destructive/[0.06]",
  },
};

const WEBSITE_URL =
  "https://madrasatywebsite.netlify.app/";

const actionsByRole: Record<
  QuickActionRole,
  QuickAction[]
> = {
  "super-admin": [
    {
      label: "Users",
      icon: Users,
      path: "/users",
      color: "primary",
    },
    {
      label: "Finance",
      icon: WalletCards,
      path: "/finance",
      color: "success",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
      color: "warning",
    },
    {
      label: "Reports",
      icon: FileText,
      path: "/reports",
      color: "info",
    },
    {
      label: "View Website",
      icon: Globe2,
      external: true,
      color: "primary",
    },
  ],

  adviser: [
    {
      label: "Students",
      icon: GraduationCap,
      path: "/users/students",
      color: "primary",
    },
    {
      label: "Attendance",
      icon: ClipboardCheck,
      path: "/attendance",
      color: "warning",
    },
    {
      label: "Grades",
      icon: BookOpen,
      path: "/academic/grades",
      color: "info",
    },
    {
      label: "View Website",
      icon: Globe2,
      external: true,
      color: "primary",
    },
  ],

  secretary: [
    {
      label: "Finance",
      icon: WalletCards,
      path: "/finance",
      color: "success",
    },
    {
      label: "Users",
      icon: Users,
      path: "/users",
      color: "primary",
    },
    {
      label: "Schedules",
      icon: CalendarDays,
      path: "/schedules",
      color: "info",
    },
    {
      label: "View Website",
      icon: Globe2,
      external: true,
      color: "primary",
    },
  ],
};

export function QuickActions({
  role,
}: QuickActionsProps) {
  const navigate = useNavigate();

  const actions = actionsByRole[role];

  const handleAction = (action: QuickAction) => {
    if (action.external) {
      window.open(
        WEBSITE_URL,
        "_blank",
        "noopener,noreferrer",
      );

      return;
    }

    if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <section
      className="
        w-full
        rounded-2xl
        border border-border/60
        bg-card
        p-4
        shadow-[0_6px_24px_rgba(148,163,184,0.06)]
      "
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Shortcuts
          </p>

          <h3 className="mt-0.5 text-base font-semibold tracking-tight text-foreground">
            Quick Actions
          </h3>
        </div>

        <div
          className="
            flex h-8 w-8
            items-center justify-center
            rounded-lg
            bg-primary/[0.07]
            text-primary
          "
        >
          <UserPlus
            className="h-4 w-4"
            strokeWidth={1.8}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-1.5">
        {actions.map((action) => {
          const Icon = action.icon;
          const colors = colorMap[action.color];

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => handleAction(action)}
              className={[
                "group flex w-full items-center gap-3",
                "rounded-xl border border-border/40",
                "bg-background px-3 py-2.5",
                "text-start",
                "transition-all duration-200",
                "hover:border-border",
                colors.hover,
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/30",
              ].join(" ")}
            >
              {/* Icon */}
              <span
                className={[
                  "flex h-9 w-9 shrink-0",
                  "items-center justify-center",
                  "rounded-lg",
                  colors.icon,
                  "transition-transform duration-200",
                  "group-hover:scale-105",
                ].join(" ")}
              >
                <Icon
                  className="h-[17px] w-[17px]"
                  strokeWidth={1.8}
                />
              </span>

              {/* Label */}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-foreground">
                  {action.label}
                </span>

                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  Open
                </span>
              </span>

              {/* Arrow */}
              <span
                className="
                  text-xs
                  text-muted-foreground/50
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                "
              >
                →
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}