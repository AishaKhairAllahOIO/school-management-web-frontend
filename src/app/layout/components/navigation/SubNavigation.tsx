import {
  Banknote,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  LockKeyhole,
  ReceiptText,
  Scale,
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

import {
  useLocale,
} from "@/app/providers/locale";
import type {
  TranslationDictionary,
} from "@/app/translations/types";

type SubNavigationLabelKey =
  keyof TranslationDictionary["layout"]["subNavigation"];

type SubNavigationItem = {
  titleKey: Exclude<
    SubNavigationLabelKey,
    "sectionNavigation"
  >;
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
      {
        titleKey: "students",
        path: "/attendance/students",
        icon: Users,
      },
      {
        titleKey: "staff",
        path: "/attendance/staff",
        icon: UserCheck,
      },
    ],
  },
  {
    basePath: "/scheduling",
    items: [
      {
        titleKey: "classes",
        path: "/scheduling/classes",
        icon: CalendarDays,
      },
      {
        titleKey: "exams",
        path: "/scheduling/exams",
        icon: FileText,
      },
      {
        titleKey: "quizzes",
        path: "/scheduling/quizzes",
        icon: BookOpen,
      },
      {
        titleKey: "holidays",
        path: "/scheduling/holidays",
        icon: CalendarDays,
      },
    ],
  },
  {
    basePath: "/finance",
    items: [
      {
        titleKey: "studentContracts",
        path: "/finance/contracts",
        icon: FileText,
        group: "student",
      },
      {
        titleKey: "studentInstallments",
        path: "/finance/installments",
        icon: CalendarDays,
        group: "student",
      },
      {
        titleKey: "studentPayments",
        path: "/finance/payments",
        icon: ReceiptText,
        group: "student",
      },
      {
        titleKey: "staffPayroll",
        path: "/finance/payroll",
        icon: Banknote,
        group: "staff",
      },
    ],
  },
  {
    basePath: "/communications",
    items: [
      {
        titleKey: "announcements",
        path: "/communications/announcements",
        icon: Bell,
      },
      {
        titleKey: "activities",
        path: "/communications/activities",
        icon: FileText,
      },
      {
        titleKey: "schoolLaws",
        path: "/communications/laws",
        icon: Scale,
      },
    ],
  },
  {
    basePath: "/settings",
    items: [
      {
        titleKey: "general",
        path: "/settings/general",
        icon: Building2,
      },
      {
        titleKey: "academic",
        path: "/settings/academic",
        icon: BookOpen,
      },
      {
        titleKey: "financial",
        path: "/settings/financial",
        icon: Wallet,
      },
      {
        titleKey: "attendance",
        path: "/settings/attendance",
        icon: CalendarDays,
      },
      {
        titleKey: "roles",
        path: "/settings/roles",
        icon: ShieldCheck,
      },
      {
        titleKey: "permissions",
        path: "/settings/permissions",
        icon: LockKeyhole,
      },
    ],
  },
];

function TabItem({
  titleKey,
  path,
  icon: Icon,
}: SubNavigationItem) {
  const { t } = useLocale();
  const title =
    t.layout.subNavigation[titleKey];

  const staffPayroll =
    path === "/finance/payroll";

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

          <span className="whitespace-nowrap">
            {title}
          </span>

          <span
            aria-hidden
            className={[
              "absolute bottom-0 left-4 right-4 h-[2px] origin-center rounded-full transition-transform duration-200",
              staffPayroll
                ? "bg-info"
                : "bg-primary",
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
  const { direction, t } = useLocale();

  const hasFinanceGroups = items.some(
    (item) => item.group === "staff",
  );

  const studentItems = hasFinanceGroups
    ? items.filter(
        (item) => item.group !== "staff",
      )
    : items;

  const staffItems = hasFinanceGroups
    ? items.filter(
        (item) => item.group === "staff",
      )
    : [];

  return (
    <nav
      aria-label={
        t.layout.subNavigation
          .sectionNavigation
      }
      className="w-full min-w-0 overflow-hidden rounded-[22px] border border-border/60 bg-card/95 p-2 shadow-[0_8px_28px_rgba(38,24,84,0.045)] backdrop-blur-sm"
    >
      <div className="flex h-11 w-full min-w-0 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-1">
          {studentItems.map((item) => (
            <TabItem
              key={item.path}
              {...item}
            />
          ))}
        </div>

        {staffItems.length ? (
          <div
            className={[
              "flex min-w-max items-center gap-1",
              direction === "rtl"
                ? "mr-2 border-r border-border/55 pr-3"
                : "ml-2 border-l border-border/55 pl-3",
            ].join(" ")}
          >
            {staffItems.map((item) => (
              <TabItem
                key={item.path}
                {...item}
              />
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

  const currentSection =
    subNavigationSections.find(
      (section) =>
        pathname === section.basePath ||
        pathname.startsWith(
          `${section.basePath}/`,
        ),
    );

  return currentSection ? (
    <DefaultSubNavigation
      items={currentSection.items}
    />
  ) : null;
}
