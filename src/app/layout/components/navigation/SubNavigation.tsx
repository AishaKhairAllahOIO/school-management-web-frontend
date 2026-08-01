import {
  Banknote,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

type SubNavigationItem = {
  title: string;
  path: string;
  icon: LucideIcon;
  group?: "student" | "staff";
};

type SubNavigationSection = {
  basePath: string;
  items: SubNavigationItem[];
};

const subNavigationSections: SubNavigationSection[] = [
  {
    basePath: "/attendance",
    items: [
      { title: "Students", path: "/attendance/students", icon: Users },
      { title: "Staff", path: "/attendance/staff", icon: UserCheck },
    ],
  },
  {
    basePath: "/scheduling",
    items: [
      { title: "Classes", path: "/scheduling/classes", icon: CalendarDays },
      { title: "Exams", path: "/scheduling/exams", icon: FileText },
      { title: "Quizzes", path: "/scheduling/quizzes", icon: BookOpen },
      { title: "Holidays", path: "/scheduling/holidays", icon: CalendarDays },
    ],
  },
  {
    basePath: "/finance",
    items: [
      {
        title: "Student Contracts",
        path: "/finance/contracts",
        icon: FileText,
        group: "student",
      },
      {
        title: "Student Installments",
        path: "/finance/installments",
        icon: CalendarDays,
        group: "student",
      },
      {
        title: "Student Payments",
        path: "/finance/payments",
        icon: ReceiptText,
        group: "student",
      },
      {
        title: "Staff Payroll",
        path: "/finance/payroll",
        icon: Banknote,
        group: "staff",
      },
    ],
  },
  {
    basePath: "/communications",
    items: [
      { title: "Announcements", path: "/communications/announcements", icon: Bell },
      { title: "Activities", path: "/communications/activities", icon: FileText },
    ],
  },
  {
    basePath: "/settings",
    items: [
      { title: "General", path: "/settings/general", icon: Building2 },
      { title: "Academic", path: "/settings/academic", icon: BookOpen },
      { title: "Financial", path: "/settings/financial", icon: Wallet },
      { title: "Attendance", path: "/settings/attendance", icon: CalendarDays },
      { title: "Roles", path: "/settings/roles", icon: ShieldCheck },
      { title: "Permissions", path: "/settings/permissions", icon: LockKeyhole },
    ],
  },
];

function TabItem({ title, path, icon: Icon }: SubNavigationItem) {
  const staffPayroll = path === "/finance/payroll";

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        [
          "group relative inline-flex h-11 min-w-max items-center justify-center gap-2 rounded-[14px] px-4 text-[13px] font-medium transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-4",
          staffPayroll
            ? "focus-visible:ring-info/10"
            : "focus-visible:ring-primary/10",
          isActive
            ? staffPayroll
              ? "bg-info/[0.09] text-info"
              : "bg-primary/[0.07] text-primary"
            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden
            size={17}
            strokeWidth={1.8}
            className={
              isActive
                ? staffPayroll
                  ? "shrink-0 text-info"
                  : "shrink-0 text-primary"
                : "shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            }
          />
          <span className="whitespace-nowrap">{title}</span>
          <span
            aria-hidden
            className={[
              "absolute bottom-0 left-4 right-4 h-[2px] origin-center rounded-full transition-transform duration-200",
              staffPayroll ? "bg-info" : "bg-primary",
              isActive ? "scale-x-100" : "scale-x-0",
            ].join(" ")}
          />
        </>
      )}
    </NavLink>
  );
}

function DefaultSubNavigation({ items }: { items: SubNavigationItem[] }) {
  const hasFinanceGroups = items.some((item) => item.group === "staff");
  const studentItems = hasFinanceGroups
    ? items.filter((item) => item.group !== "staff")
    : items;
  const staffItems = hasFinanceGroups
    ? items.filter((item) => item.group === "staff")
    : [];

  return (
    <nav
      aria-label="Section navigation"
      className="w-full min-w-0 overflow-hidden rounded-[22px] border border-border/60 bg-card/95 p-2 shadow-[0_8px_28px_rgba(38,24,84,0.045)] backdrop-blur-sm"
    >
      <div className="flex h-11 w-full min-w-0 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-1">
          {studentItems.map((item) => (
            <TabItem key={item.path} {...item} />
          ))}
        </div>

        {staffItems.length ? (
          <div className="ml-2 flex min-w-max items-center gap-1 border-l border-border/55 pl-3">
            {staffItems.map((item) => (
              <TabItem key={item.path} {...item} />
            ))}
          </div>
        ) : null}
      </div>
    </nav>
  );
}

export function SubNavigation() {
  const { pathname } = useLocation();

  if (
    pathname === "/users" ||
    pathname.startsWith("/users/") ||
    pathname === "/academics" ||
    pathname.startsWith("/academics/")
  ) {
    return null;
  }

  const currentSection = subNavigationSections.find(
    (section) =>
      pathname === section.basePath ||
      pathname.startsWith(`${section.basePath}/`),
  );

  return currentSection ? (
    <DefaultSubNavigation items={currentSection.items} />
  ) : null;
}
