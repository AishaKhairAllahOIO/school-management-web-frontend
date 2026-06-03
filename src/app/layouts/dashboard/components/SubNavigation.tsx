import { useEffect, useMemo, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import lottie from "lottie-web";
import { NavLink, useLocation } from "react-router-dom";

import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  HeartHandshake,
  LockKeyhole,
  Settings,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

import folderAnimation from "@/assets/animations/folder.json";

type AccentColor = {
  main: string;
  light: string;
  dark: string;
};

type SubNavigationItem = {
  title: string;
  path: string;
  icon: LucideIcon;
};

type SubNavigationSection = {
  basePath: string;
  items: SubNavigationItem[];
};

const defaultAccent: AccentColor = {
  main: "#5B4FC7",
  light: "#6D5FDB",
  dark: "#4A3FB5",
};

const userFolderColors: Record<string, AccentColor> = {
  "/users/students": { main: "#5B4FC7", light: "#6D5FDB", dark: "#4A3FB5" },
  "/users/teachers": { main: "#5B6FE8", light: "#7B8CFF", dark: "#4D5FD4" },
  "/users/parents": { main: "#4EABBE", light: "#5FC6DA", dark: "#3F92A3" },
  "/users/secretaries": { main: "#F59E0B", light: "#FBBF24", dark: "#D97706" },
  "/users/supervisors": { main: "#3D5A9E", light: "#5B7AC8", dark: "#304A86" },
  "/users/counselors": { main: "#10B981", light: "#34D399", dark: "#059669" },
  "/users/service-staff": { main: "#EF7B6C", light: "#FF8B7D", dark: "#D96558" },
};

const subNavigationItems: SubNavigationSection[] = [
  {
    basePath: "/users",
    items: [
      { title: "Students", path: "/users/students", icon: GraduationCap },
      { title: "Teachers", path: "/users/teachers", icon: BookOpen },
      { title: "Parents", path: "/users/parents", icon: Users },
      { title: "Secretaries", path: "/users/secretaries", icon: Briefcase },
      { title: "Supervisors", path: "/users/supervisors", icon: ShieldCheck },
      { title: "Counselors", path: "/users/counselors", icon: HeartHandshake },
      { title: "Service Staff", path: "/users/service-staff", icon: UserCog },
    ],
  },
  {
    basePath: "/academics",
    items: [
      { title: "Classes", path: "/academics/classes", icon: BookOpen },
      { title: "Sections", path: "/academics/sections", icon: CalendarDays },
      { title: "Subjects", path: "/academics/subjects", icon: FileText },
      { title: "Classrooms", path: "/academics/classrooms", icon: BookOpen },
      { title: "Curriculum", path: "/academics/curriculum", icon: GraduationCap },
      { title: "Promotions", path: "/academics/promotions", icon: UserCheck },
    ],
  },
  {
    basePath: "/attendance",
    items: [
      { title: "Students", path: "/attendance/students", icon: Users },
      { title: "Staff", path: "/attendance/staff", icon: UserCheck },
      { title: "Vacations", path: "/attendance/vacations", icon: CalendarDays },
    ],
  },
  {
    basePath: "/scheduling",
    items: [
      { title: "Classes", path: "/scheduling/classes", icon: CalendarDays },
      { title: "Teachers", path: "/scheduling/teachers", icon: UserCheck },
      { title: "Exams", path: "/scheduling/exams", icon: FileText },
      { title: "Quizzes", path: "/scheduling/quizzes", icon: BookOpen },
      { title: "Holidays", path: "/scheduling/holidays", icon: CalendarDays },
    ],
  },
  {
    basePath: "/finance",
    items: [
      { title: "Fees", path: "/finance/fees", icon: Wallet },
      { title: "Payments", path: "/finance/payments", icon: Wallet },
      { title: "Salaries", path: "/finance/salaries", icon: Briefcase },
    ],
  },
  {
    basePath: "/communication",
    items: [
      { title: "Announcements", path: "/communication/announcements", icon: Bell },
      { title: "Notifications", path: "/communication/notifications", icon: Bell },
      { title: "Activities", path: "/communication/activities", icon: CalendarDays },
    ],
  },
  {
    basePath: "/settings",
    items: [
      { title: "Roles", path: "/settings/roles", icon: ShieldCheck },
      { title: "Permissions", path: "/settings/permissions", icon: LockKeyhole },
      { title: "General", path: "/settings/general", icon: Building2 },
      { title: "Academic", path: "/settings/academic", icon: BookOpen },
      { title: "Security", path: "/settings/security", icon: ShieldCheck },
    ],
  },
];

function hexToLottieColor(hexColor: string) {
  const hex = hexColor.replace("#", "");

  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
    1,
  ];
}

function getFolderAnimation(color: AccentColor) {
  const animation = JSON.parse(JSON.stringify(folderAnimation));

  const colors = [
    hexToLottieColor(color.main),
    hexToLottieColor(color.light),
    hexToLottieColor(color.dark),
  ];

  let index = 0;

  function walk(value: unknown) {
    if (!value || typeof value !== "object") return;

    const objectValue = value as Record<string, unknown>;

    if (objectValue.ty === "fl") {
      const fillColor = objectValue.c as { k?: number[] } | undefined;

      if (fillColor?.k) {
        fillColor.k = colors[index % colors.length];
        index += 1;
      }
    }

    Object.values(objectValue).forEach(walk);
  }

  walk(animation);

  return animation;
}

function FolderItem({
  title,
  path,
  isActive,
  icon: Icon,
}: SubNavigationItem & { isActive: boolean }) {
  const animationRef = useRef<HTMLDivElement | null>(null);
  const color = userFolderColors[path] ?? defaultAccent;

  const folderAnimationData = useMemo(() => getFolderAnimation(color), [color]);

  useEffect(() => {
    if (!animationRef.current) return;

    const animation = lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: folderAnimationData,
    });

    animation.setSpeed(0.8);

    if (isActive) {
      animation.playSegments([0, 30], true);
    } else {
      animation.goToAndStop(0, true);
    }

    return () => {
      animation.destroy();
    };
  }, [isActive, folderAnimationData]);

  return (
    <NavLink to={path} className="group relative shrink-0">
      <div
        className={[
          "relative flex h-[96px] w-[96px] items-center justify-center transition-all duration-300",
          isActive ? "scale-[1.04]" : "hover:scale-[1.02]",
        ].join(" ")}
      >
        <div ref={animationRef} className="absolute inset-0" />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 px-2 pt-5">
          <Icon
            size={16}
            className="text-primary-foreground"
            strokeWidth={1.8}
          />

          <span className="text-center text-[13px] font-medium leading-tight text-primary-foreground">
            {title}
          </span>
        </div>
      </div>
    </NavLink>
  );
}

function TabItem({
  title,
  path,
  isActive,
  icon: Icon,
}: SubNavigationItem & { isActive: boolean }) {
  return (
    <NavLink
      to={path}
      className={[
        "group relative flex h-14 shrink-0 items-center justify-center gap-3 rounded-2xl px-8 text-[14px] font-semibold transition-all duration-300",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
      ].join(" ")}
    >
      <Icon
        size={18}
        strokeWidth={1.9}
        className={isActive ? "text-primary" : "text-muted-foreground"}
      />

      <span>{title}</span>
    </NavLink>
  );
}

export function SubNavigation() {
  const location = useLocation();

  const currentSection = subNavigationItems.find((section) =>
    location.pathname.startsWith(section.basePath)
  );

  if (!currentSection) return null;

  const isUsersSection = currentSection.basePath === "/users";

  return (
    <div className="pt-5">
      <div
        className={[
          "w-full overflow-hidden",
          !isUsersSection
            ? "rounded-3xl border border-border/70 bg-card/80 p-1.5 shadow-soft backdrop-blur-xl"
            : "",
        ].join(" ")}
      >
        <nav
          className={[
            "scrollbar-thin flex w-full max-w-full overflow-x-auto",
            isUsersSection
              ? "items-center gap-4 pb-4"
              : "items-center justify-between gap-2",
          ].join(" ")}
        >
          {currentSection.items.map((item) =>
            isUsersSection ? (
              <FolderItem
                key={item.path}
                title={item.title}
                path={item.path}
                icon={item.icon}
                isActive={location.pathname === item.path}
              />
            ) : (
              <TabItem
                key={item.path}
                title={item.title}
                path={item.path}
                icon={item.icon}
                isActive={location.pathname === item.path}
              />
            )
          )}
        </nav>
      </div>
    </div>
  );
}