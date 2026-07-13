import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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

type FolderAccent = {
  background: string;
  tab: string;
  border: string;
  iconBackground: string;
  iconColor: string;
  shadow: string;
  activeLine: string;
};

const studentAccent: FolderAccent = {
  background:
    "linear-gradient(135deg, rgba(239,235,255,0.98) 0%, rgba(248,246,255,0.98) 100%)",

  tab:
    "linear-gradient(135deg, #8b6cff 0%, #b9a6ff 100%)",

  border:
    "rgba(129, 92, 246, 0.25)",

  iconBackground:
    "rgba(255,255,255,0.72)",

  iconColor: "#6540e8",

  shadow:
    "0 16px 40px rgba(101, 64, 232, 0.14)",

  activeLine:
    "linear-gradient(90deg, #6d3df5 0%, #9a7bff 100%)",
};

const teacherAccent: FolderAccent = {
  background:
    "linear-gradient(135deg, rgba(235,242,255,0.98) 0%, rgba(247,249,255,0.98) 100%)",

  tab:
    "linear-gradient(135deg, #76a1ff 0%, #b2ccff 100%)",

  border:
    "rgba(82, 122, 235, 0.22)",

  iconBackground:
    "rgba(255,255,255,0.72)",

  iconColor: "#527aeb",

  shadow:
    "0 16px 40px rgba(82, 122, 235, 0.13)",

  activeLine:
    "linear-gradient(90deg, #527aeb 0%, #88a9ff 100%)",
};

const staffAccent: FolderAccent = {
  background:
    "linear-gradient(135deg, rgba(229,250,250,0.98) 0%, rgba(243,253,253,0.98) 100%)",

  tab:
    "linear-gradient(135deg, #65cbd0 0%, #a7e4e7 100%)",

  border:
    "rgba(48, 176, 184, 0.23)",

  iconBackground:
    "rgba(255,255,255,0.72)",

  iconColor: "#24aeb5",

  shadow:
    "0 16px 40px rgba(36, 174, 181, 0.13)",

  activeLine:
    "linear-gradient(90deg, #23adb5 0%, #71d6da 100%)",
};

const staffItems: SubNavigationItem[] = [
  {
    title: "Secretaries",
    path: "/users/secretaries",
    icon: Briefcase,
  },
  {
    title: "Supervisors",
    path: "/users/supervisors",
    icon: ShieldCheck,
  },
  {
    title: "Counselors",
    path: "/users/counselors",
    icon: HeartHandshake,
  },
  {
    title: "Service Staff",
    path: "/users/service-staff",
    icon: UserCog,
  },
];

const subNavigationItems: SubNavigationSection[] = [
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
        title: "Fees",
        path: "/finance/fees",
        icon: Wallet,
      },
      {
        title: "Payments",
        path: "/finance/payments",
        icon: Wallet,
      },
      {
        title: "Installments",
        path: "/finance/installments",
        icon: Wallet,
      },
      {
        title: "Payroll History",
        path: "/finance/payroll-history",
        icon: Wallet,
      },
      {
        title: "Salaries",
        path: "/finance/salaries",
        icon: Briefcase,
      },
      {
        title: "Deductions",
        path: "/finance/deductions",
        icon: Wallet,
      },
    ],
  },

  {
    basePath: "/communication",

    items: [
      {
        title: "Announcements",
        path: "/communication/announcements",
        icon: Bell,
      },
      {
        title: "Notifications",
        path: "/communication/notifications",
        icon: Bell,
      },
      {
        title: "Messages",
        path: "/communication/messages",
        icon: FileText,
      },
      {
        title: "Complaints",
        path: "/communication/complaints",
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
    ],
  },
];

function isStaffRoute(
  pathname: string,
): boolean {
  return staffItems.some(
    (item) =>
      pathname === item.path ||
      pathname.startsWith(
        `${item.path}/`,
      ),
  );
}

function FolderShape({
  accent,
}: {
  accent: FolderAccent;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute",
          "left-0 top-0 h-[31px] w-[92px]",
          "rounded-tl-[22px]",
          "rounded-tr-[34px]",
        ].join(" ")}
        style={{
          background: accent.tab,
          clipPath:
            "polygon(0 0, 70% 0, 84% 45%, 100% 58%, 100% 100%, 0 100%)",
        }}
      />

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute",
          "inset-x-0 bottom-0 top-[18px]",
          "rounded-[22px]",
        ].join(" ")}
        style={{
          background: accent.background,
          border: `1px solid ${accent.border}`,
        }}
      />
    </>
  );
}

function FolderIcon({
  icon: Icon,
  accent,
}: {
  icon: LucideIcon;
  accent: FolderAccent;
}) {
  return (
    <span
      className={[
        "relative z-10",
        "flex h-14 w-14 shrink-0",
        "items-center justify-center",
        "rounded-full",
        "backdrop-blur-sm",
      ].join(" ")}
      style={{
        background:
          accent.iconBackground,

        color:
          accent.iconColor,

        boxShadow:
          "0 10px 24px rgba(40, 32, 90, 0.10)",
      }}
    >
      <Icon
        size={27}
        strokeWidth={1.8}
      />
    </span>
  );
}

function UserFolderLink({
  title,
  path,
  icon,
  accent,
  isActive,
}: SubNavigationItem & {
  accent: FolderAccent;
  isActive: boolean;
}) {
  return (
    <NavLink
      to={path}
      aria-current={
        isActive
          ? "page"
          : undefined
      }
      className={[
        "group relative block",
        "h-[148px] w-[244px]",
        "shrink-0 rounded-[22px]",
        "transition-all duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-4",
        "focus-visible:ring-primary/15",
        isActive
          ? "-translate-y-1"
          : "hover:-translate-y-1",
      ].join(" ")}
      style={{
        filter: isActive
          ? `drop-shadow(${accent.shadow})`
          : undefined,
      }}
    >
      <FolderShape
        accent={accent}
      />

      <span
        className={[
          "absolute inset-x-5",
          "bottom-5 top-9 z-10",
          "flex items-center gap-4",
        ].join(" ")}
      >
        <FolderIcon
          icon={icon}
          accent={accent}
        />

        <span className="min-w-0">
          <span className="block text-[19px] font-black tracking-[-0.025em] text-foreground">
            {title}
          </span>

          <span
            className={[
              "mt-2 inline-flex",
              "items-center gap-1.5",
              "rounded-full px-2.5 py-1",
              "text-[10px] font-bold",
            ].join(" ")}
            style={{
              background:
                `${accent.iconColor}14`,

              color:
                accent.iconColor,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  accent.iconColor,
              }}
            />

            {isActive
              ? "Active"
              : "Open"}
          </span>
        </span>

        <ChevronRight
          size={19}
          className={[
            "ml-auto",
            "text-muted-foreground",
            "transition-transform",
            "group-hover:translate-x-1",
          ].join(" ")}
        />
      </span>

      {isActive ? (
        <span
          aria-hidden="true"
          className={[
            "absolute -bottom-4",
            "left-0 right-0 h-1",
            "rounded-full",
          ].join(" ")}
          style={{
            background:
              accent.activeLine,
          }}
        />
      ) : null}
    </NavLink>
  );
}

function StaffFolder({
  pathname,
}: {
  pathname: string;
}) {
  const wrapperRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const routeIsStaff =
    isStaffRoute(pathname);

  const [
    isOpen,
    setIsOpen,
  ] = useState(routeIsStaff);

  useEffect(() => {
    if (routeIsStaff) {
      setIsOpen(true);
    }
  }, [routeIsStaff]);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={[
        "relative",
        "h-[148px] w-[244px]",
        "shrink-0",
      ].join(" ")}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        className={[
          "group relative block",
          "h-full w-full",
          "rounded-[22px]",
          "text-left",
          "transition-all duration-200",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/15",
          routeIsStaff || isOpen
            ? "-translate-y-1"
            : "hover:-translate-y-1",
        ].join(" ")}
        style={{
          filter:
            routeIsStaff || isOpen
              ? `drop-shadow(${staffAccent.shadow})`
              : undefined,
        }}
      >
        <FolderShape
          accent={staffAccent}
        />

        <span
          className={[
            "absolute inset-x-5",
            "bottom-5 top-9 z-10",
            "flex items-center gap-4",
          ].join(" ")}
        >
          <FolderIcon
            icon={Users}
            accent={staffAccent}
          />

          <span className="min-w-0">
            <span className="block text-[19px] font-black tracking-[-0.025em] text-foreground">
              Staff
            </span>

            <span
              className={[
                "mt-2 inline-flex",
                "items-center gap-1.5",
                "rounded-full px-2.5 py-1",
                "text-[10px] font-bold",
              ].join(" ")}
              style={{
                background:
                  `${staffAccent.iconColor}14`,

                color:
                  staffAccent.iconColor,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background:
                    staffAccent.iconColor,
                }}
              />

              4 categories
            </span>
          </span>

          <ChevronDown
            size={20}
            className={[
              "ml-auto",
              "text-foreground",
              "transition-transform",
              isOpen
                ? "rotate-180"
                : "",
            ].join(" ")}
          />
        </span>
      </button>

      {routeIsStaff ? (
        <span
          aria-hidden="true"
          className={[
            "absolute -bottom-4",
            "left-0 right-0 h-1",
            "rounded-full",
          ].join(" ")}
          style={{
            background:
              staffAccent.activeLine,
          }}
        />
      ) : null}

      {isOpen ? (
        <div
          role="menu"
          className={[
            "absolute left-2 top-[156px]",
            "z-50 w-[226px]",
            "overflow-hidden",
            "rounded-[20px]",
            "border border-border/70",
            "bg-card/95 p-2",
            "shadow-[0_22px_55px_rgba(31,24,70,0.18)]",
            "backdrop-blur-xl",
            "animate-in fade-in",
            "slide-in-from-top-2",
            "duration-200",
          ].join(" ")}
        >
          {staffItems.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                pathname ===
                  item.path ||
                pathname.startsWith(
                  `${item.path}/`,
                );

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  role="menuitem"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className={[
                    "group flex",
                    "items-center gap-3",
                    "rounded-[14px]",
                    "px-3 py-2.5",
                    "transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/70",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-9 w-9",
                      "shrink-0 items-center",
                      "justify-center",
                      "rounded-full",
                      active
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground group-hover:text-primary",
                    ].join(" ")}
                  >
                    <Icon
                      size={17}
                    />
                  </span>

                  <span className="text-sm font-bold">
                    {item.title}
                  </span>

                  <ChevronRight
                    size={16}
                    className={[
                      "ml-auto",
                      "text-muted-foreground",
                      "transition-transform",
                      "group-hover:translate-x-0.5",
                    ].join(" ")}
                  />
                </NavLink>
              );
            },
          )}
        </div>
      ) : null}
    </div>
  );
}

function UsersFolderNavigation() {
  const location =
    useLocation();

  const pathname =
    location.pathname;

  const studentsActive =
    pathname ===
      "/users/students" ||
    pathname.startsWith(
      "/users/students/",
    );

  const teachersActive =
    pathname ===
      "/users/teachers" ||
    pathname.startsWith(
      "/users/teachers/",
    );

  return (
    <nav
      aria-label="User categories"
      className={[
        "relative z-30",
        "rounded-[26px]",
        "border border-border/60",
        "bg-card/80 p-6",
        "shadow-[0_18px_55px_rgba(49,38,99,0.07)]",
        "backdrop-blur-xl",
      ].join(" ")}
    >
      <div
        className={[
          "flex min-h-[180px]",
          "items-start gap-7",
          "overflow-x-auto",
          "px-3 pb-6 pt-3",
          "[scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        <UserFolderLink
          title="Students"
          path="/users/students"
          icon={GraduationCap}
          accent={studentAccent}
          isActive={
            studentsActive
          }
        />

        <UserFolderLink
          title="Teachers"
          path="/users/teachers"
          icon={BookOpen}
          accent={teacherAccent}
          isActive={
            teachersActive
          }
        />

        <StaffFolder
          pathname={pathname}
        />
      </div>
    </nav>
  );
}

function TabItem({
  title,
  path,
  icon: Icon,
}: SubNavigationItem) {
  return (
    <NavLink
      to={path}
      className={({
        isActive,
      }) =>
        [
          "inline-flex",
          "min-w-max items-center",
          "gap-2 rounded-xl",
          "px-4 py-3",
          "text-sm font-bold",
          "transition",
          "focus-visible:outline-none",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/15",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        ].join(" ")
      }
    >
      <Icon size={17} />
      {title}
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
        {items.map(
          (item) => (
            <TabItem
              key={item.path}
              {...item}
            />
          ),
        )}
      </div>
    </nav>
  );
}

export function SubNavigation() {
  const location =
    useLocation();

  const pathname =
    location.pathname;

  const isAcademicsRoute =
    pathname === "/academics" ||
    pathname.startsWith(
      "/academics/",
    );

  if (isAcademicsRoute) {
    return null;
  }

  const isUsersRoute =
    pathname === "/users" ||
    pathname.startsWith(
      "/users/",
    );

  if (isUsersRoute) {
    return (
      <UsersFolderNavigation />
    );
  }

  const currentSection =
    subNavigationItems.find(
      (section) =>
        pathname.startsWith(
          section.basePath,
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