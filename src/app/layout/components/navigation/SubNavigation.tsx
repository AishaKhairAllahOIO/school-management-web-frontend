import {
  Banknote,
  BellRing,
  BookOpen,
  Building2,
  CalendarDays,
  CalendarRange,
  FileText,
  LockKeyhole,
  Megaphone,
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

type SubNavigationTone =
  | "primary"
  | "info"
  | "warning"
  | "success";

type SubNavigationGroup =
  | "student"
  | "staff";

type SubNavigationItem = {
  titleKey: Exclude<
    SubNavigationLabelKey,
    "sectionNavigation"
  >;
  path: string;
  icon: LucideIcon;
  group?: SubNavigationGroup;
  tone?: SubNavigationTone;
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
  
    ],
  },
  {
    basePath: "/finance",
    items: [
      {
        titleKey: "studentFinance",
        path: "/finance/students",
        icon: Wallet,
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
        icon: Megaphone,
        tone: "primary",
      },
      {
        titleKey: "alerts",
        path: "/communications/alerts",
        icon: BellRing,
        tone: "warning",
      },
      {
        titleKey: "activities",
        path: "/communications/activities",
        icon: CalendarRange,
        tone: "info",
      },
      {
        titleKey: "schoolLaws",
        path: "/communications/laws",
        icon: Scale,
        tone: "success",
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

function isNavigationItemActive(
  pathname: string,
  itemPath: string,
): boolean {
  if (pathname === itemPath) {
    return true;
  }

  return pathname.startsWith(
    `${itemPath}/`,
  );
}

function getToneClasses(
  tone: SubNavigationTone | undefined,
  isActive: boolean,
) {
  if (!isActive) {
    return {
      shell: [
        "border-transparent",
        "bg-transparent",
        "text-muted-foreground",
        "hover:border-border/60",
        "hover:bg-muted/45",
        "hover:text-foreground",
      ].join(" "),

      icon: [
        "text-muted-foreground",
        "transition-colors duration-200",
        "group-hover:text-foreground",
      ].join(" "),

      indicator:
        "bg-primary",

      ring:
        "focus-visible:ring-primary/10",
    };
  }

  switch (tone) {
    case "info":
      return {
        shell: [
          "border-info/20",
          "bg-info/[0.09]",
          "text-info",
        ].join(" "),

        icon:
          "text-info",

        indicator:
          "bg-info",

        ring:
          "focus-visible:ring-info/10",
      };

    case "warning":
      return {
        shell: [
          "border-warning/25",
          "bg-warning/[0.10]",
          "text-warning",
        ].join(" "),

        icon:
          "text-warning",

        indicator:
          "bg-warning",

        ring:
          "focus-visible:ring-warning/10",
      };

    case "success":
      return {
        shell: [
          "border-success/20",
          "bg-success/[0.09]",
          "text-success",
        ].join(" "),

        icon:
          "text-success",

        indicator:
          "bg-success",

        ring:
          "focus-visible:ring-success/10",
      };

    default:
      return {
        shell: [
          "border-primary/20",
          "bg-primary/[0.07]",
          "text-primary",
        ].join(" "),

        icon:
          "text-primary",

        indicator:
          "bg-primary",

        ring:
          "focus-visible:ring-primary/10",
      };
  }
}

function TabItem({
  titleKey,
  path,
  icon: Icon,
  tone,
}: SubNavigationItem) {
  const { t } =
    useLocale();

  const { pathname } =
    useLocation();

  const title =
    t.layout.subNavigation[
      titleKey
    ];

  const isActive =
    isNavigationItemActive(
      pathname,
      path,
    );

  const classes =
    getToneClasses(
      tone,
      isActive,
    );

  return (
    <NavLink
      to={path}
      data-onboarding-path={path}
      aria-label={title}
      aria-current={
        isActive
          ? "page"
          : undefined
      }
      className={[
        "group relative",
        "flex min-w-0 w-full",
        "items-center justify-center",
        "gap-2 overflow-hidden",
        "rounded-[14px] border",
        "px-2.5 py-2.5",
        "text-center text-[12px]",
        "font-medium leading-[1.2]",
        "tracking-[-0.005em]",

    
        "min-h-11",
        "sm:min-h-[46px]",
        "sm:px-3",
        "sm:text-[13px]",
        "max-w-full",

        "transition-[background-color,border-color,color]",
        "duration-200 ease-out",

        "focus-visible:outline-none",
        "focus-visible:ring-4",

        classes.ring,
        classes.shell,
      ].join(" ")}
    >
      <Icon
        aria-hidden="true"
        size={17}
        strokeWidth={
          isActive
            ? 2
            : 1.8
        }
        className={[
          "shrink-0",
          classes.icon,
        ].join(" ")}
      />

      <span
        className="
          min-w-0
          overflow-hidden
          text-ellipsis
          whitespace-normal
          break-words
        "
      >
        {title}
      </span>

      <span
        aria-hidden="true"
        className={[
          "absolute bottom-0",
          "left-3 right-3",
          "h-[2px]",
          "origin-center rounded-full",
          "transition-transform duration-200",
          classes.indicator,
          isActive
            ? "scale-x-100"
            : "scale-x-0",
        ].join(" ")}
      />
    </NavLink>
  );
}

function getGridClasses(
  itemCount: number,
) {
  if (itemCount <= 1) {
    return [
      "grid-cols-1",
      "sm:grid-cols-1",
    ].join(" ");
  }

  if (itemCount === 2) {
    return [
      "grid-cols-1",
      "min-[380px]:grid-cols-2",
    ].join(" ");
  }

  if (itemCount === 3) {
    return [
      "grid-cols-1",
      "min-[380px]:grid-cols-2",
      "md:grid-cols-3",
    ].join(" ");
  }

  if (itemCount === 4) {
    return [
      "grid-cols-1",
      "min-[380px]:grid-cols-2",
      "md:grid-cols-4",
    ].join(" ");
  }

  if (itemCount === 5) {
    return [
      "grid-cols-1",
      "min-[380px]:grid-cols-2",
      "sm:grid-cols-3",
      "xl:grid-cols-5",
    ].join(" ");
  }

  return [
    "grid-cols-1",
    "min-[380px]:grid-cols-2",
    "sm:grid-cols-3",
    "xl:grid-cols-6",
  ].join(" ");
}

function NavigationGroup({
  items,
  separated = false,
}: {
  items: SubNavigationItem[];
  separated?: boolean;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div
      className={[
        "grid w-full min-w-0",
        "gap-1.5",

        getGridClasses(
          items.length,
        ),

        separated
          ? [
              "mt-1.5",
              "border-t",
              "border-border/55",
              "pt-1.5",

           
              "lg:mt-0",
              "lg:border-t-0",
              "lg:pt-0",
            ].join(" ")
          : "",
      ].join(" ")}
    >
      {items.map(
        (item) => (
          <TabItem
            key={item.path}
            {...item}
          />
        ),
      )}
    </div>
  );
}

function DefaultSubNavigation({
  items,
}: {
  items: SubNavigationItem[];
}) {
  const { t } =
    useLocale();

  const hasFinanceGroups =
    items.some(
      (item) =>
        item.group === "staff",
    );

  const studentItems =
    hasFinanceGroups
      ? items.filter(
          (item) =>
            item.group !== "staff",
        )
      : items;

  const staffItems =
    hasFinanceGroups
      ? items.filter(
          (item) =>
            item.group === "staff",
        )
      : [];

  return (
    <nav
      aria-label={
        t.layout.subNavigation
          .sectionNavigation
      }
      className={[
        "w-full min-w-0 max-w-full",
        "overflow-hidden",
        "rounded-[18px]",
        "border border-border/60",
        "bg-card/95",
        "p-1.5",
        "backdrop-blur-sm",
        "shadow-[0_8px_28px_rgba(38,24,84,0.045)]",

        "sm:rounded-[22px]",
        "sm:p-2",
      ].join(" ")}
    >
      {hasFinanceGroups ? (
        <div
          className="
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-0
            lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
            lg:gap-2
          "
        >
          <NavigationGroup
            items={studentItems}
          />

          <div
            className="
              mt-1.5
              min-w-0
              border-t
              border-border/55
              pt-1.5

              lg:mt-0
              lg:border-s
              lg:border-t-0
              lg:ps-2
              lg:pt-0
            "
          >
            <NavigationGroup
              items={staffItems}
            />
          </div>
        </div>
      ) : (
        <NavigationGroup
          items={studentItems}
        />
      )}
    </nav>
  );
}

export function SubNavigation() {
  const { pathname } =
    useLocation();

  if (
    pathname === "/users" ||
    pathname.startsWith(
      "/users/",
    ) ||
    pathname === "/academics" ||
    pathname.startsWith(
      "/academics/",
    )
  ) {
    return null;
  }

  const currentSection =
    subNavigationSections.find(
      (section) =>
        pathname ===
          section.basePath ||
        pathname.startsWith(
          `${section.basePath}/`,
        ),
    );

  if (!currentSection) {
    return null;
  }

  return (
    <DefaultSubNavigation
      items={
        currentSection.items
      }
    />
  );
}