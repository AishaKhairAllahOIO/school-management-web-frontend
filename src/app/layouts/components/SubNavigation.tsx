import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  NavLink,
  useLocation,
} from "react-router-dom";

type SubNavigationItem = {
  title: string;
  path: string;
  icon: LucideIcon;
};

type SubNavigationSection = {
  basePath: string;
  items: SubNavigationItem[];
};

const subNavigationSections: SubNavigationSection[] =
  [
    {
      basePath: "/attendance",
      items: [
        {
          title: "Students",
          path: "/attendance/students",
          icon: Users,
        },
        {
          title: "Staff",
          path: "/attendance/staff",
          icon: UserCheck,
        },
        {
          title: "Vacations",
          path: "/attendance/vacations",
          icon: CalendarDays,
        },
      ],
    },
    {
      basePath: "/scheduling",
      items: [
        {
          title: "Classes",
          path: "/scheduling/classes",
          icon: CalendarDays,
        },
        {
          title: "Teachers",
          path: "/scheduling/teachers",
          icon: UserCheck,
        },
        {
          title: "Exams",
          path: "/scheduling/exams",
          icon: FileText,
        },
        {
          title: "Quizzes",
          path: "/scheduling/quizzes",
          icon: BookOpen,
        },
        {
          title: "Holidays",
          path: "/scheduling/holidays",
          icon: CalendarDays,
        },
      ],
    },
    {
      basePath: "/finance",
      items: [
        {
          title: "Operations",
          path: "/finance",
          icon: Wallet,
        },
      ],
    },
    {
      basePath: "/communications",
      items: [
        {
          title: "Announcements",
          path: "/communications/announcements",
          icon: Bell,
        },
        {
          title: "Notifications",
          path: "/communications/notifications",
          icon: Bell,
        },
        {
          title: "Messages",
          path: "/communications/messages",
          icon: FileText,
        },
        {
          title: "Complaints",
          path: "/communications/complaints",
          icon: FileText,
        },
      ],
    },
    {
      basePath: "/settings",
      items: [
        {
          title: "General",
          path: "/settings/general",
          icon: Building2,
        },
        {
          title: "Academic",
          path: "/settings/academic",
          icon: BookOpen,
        },
        {
          title: "Roles",
          path: "/settings/roles",
          icon: ShieldCheck,
        },
        {
          title: "Permissions",
          path: "/settings/permissions",
          icon: LockKeyhole,
        },
        {
          title: "Financial",
          path: "/settings/financial",
          icon: Wallet,
        },
      ],
    },
  ];

function TabItem({
  title,
  path,
  icon: Icon,
}: SubNavigationItem) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        [
          "group relative",
          "inline-flex h-14 min-w-max",
          "items-center justify-center gap-2.5",
          "rounded-2xl px-5",
          "text-[14px] font-medium",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/10",
          isActive
            ? [
                "bg-primary/[0.07]",
                "text-primary",
              ].join(" ")
            : [
                "text-muted-foreground",
                "hover:bg-muted/45",
                "hover:text-foreground",
              ].join(" "),
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
            className={[
              "shrink-0",
              "transition-colors duration-200",
              isActive
                ? "text-primary"
                : [
                    "text-muted-foreground",
                    "group-hover:text-foreground",
                  ].join(" "),
            ].join(" ")}
          />

          <span className="whitespace-nowrap">
            {title}
          </span>

          <span
            aria-hidden="true"
            className={[
              "absolute bottom-0",
              "left-5 right-5",
              "h-[2px]",
              "origin-center rounded-full",
              "bg-primary",
              "transition-transform duration-200",
              isActive
                ? "scale-x-100"
                : "scale-x-0",
            ].join(" ")}
          />
        </>
      )}
    </NavLink>
  );
}

function DefaultSubNavigation({
  items,
}: {
  items: SubNavigationItem[];
}) {
  return (
    <nav
      aria-label="Section navigation"
      className={[
        "w-full min-w-0",
        "overflow-hidden",
        "rounded-[26px]",
        "border border-border/60",
        "bg-card/95",
        "p-2",
        "shadow-[0_10px_35px_rgba(38,24,84,0.05)]",
        "backdrop-blur-sm",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-14 w-full min-w-0",
          "items-center gap-1.5",
          "overflow-x-auto",
          "[scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {items.map((item) => (
          <TabItem
            key={item.path}
            {...item}
          />
        ))}
      </div>
    </nav>
  );
}

export function SubNavigation() {
  const { pathname } = useLocation();

  const isUsersRoute =
    pathname === "/users" ||
    pathname.startsWith("/users/");

  if (isUsersRoute) {
    return null;
  }

  const isAcademicsRoute =
    pathname === "/academics" ||
    pathname.startsWith("/academics/");

  if (isAcademicsRoute) {
    return null;
  }

  const currentSection =
    subNavigationSections.find(
      (section) =>
        pathname === section.basePath ||
        pathname.startsWith(
          `${section.basePath}/`,
        ),
    );

  if (!currentSection) {
    return null;
  }

  return (
    <DefaultSubNavigation
      items={currentSection.items}
    />
  );
}