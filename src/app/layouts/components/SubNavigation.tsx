import {
  Bell,
  BookOpen,
  Briefcase,
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

const subNavigationSections: SubNavigationSection[] = [
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
          "inline-flex min-w-max items-center gap-2",
          "rounded-xl px-4 py-3",
          "text-sm font-semibold",
          "transition-colors duration-200",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/15",
          isActive
            ? [
                "bg-primary",
                "text-primary-foreground",
                "shadow-sm",
              ].join(" ")
            : [
                "text-muted-foreground",
                "hover:bg-muted",
                "hover:text-foreground",
              ].join(" "),
        ].join(" ")
      }
    >
      <Icon
        aria-hidden="true"
        size={17}
        strokeWidth={1.8}
      />

      <span>{title}</span>
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
        "rounded-3xl",
        "border border-border/70",
        "bg-card px-3 py-2",
        "shadow-soft",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-2",
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

  const currentSection = subNavigationSections.find(
    (section) =>
      pathname === section.basePath ||
      pathname.startsWith(`${section.basePath}/`),
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