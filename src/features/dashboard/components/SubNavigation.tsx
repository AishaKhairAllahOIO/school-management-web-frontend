import { NavLink, useLocation } from "react-router-dom";

const subNavigationItems = [
  {
    basePath: "/users",
    items: [
      { title: "Students", path: "/users/students" },
      { title: "Teachers", path: "/users/teachers" },
      { title: "Parents", path: "/users/parents" },
      { title: "Advisors", path: "/users/advisors" },
      { title: "Staff", path: "/users/staff" },
    ],
  },
  {
    basePath: "/academics",
    items: [
      { title: "Classes", path: "/academics/classes" },
      { title: "Sections", path: "/academics/sections" },
      { title: "Subjects", path: "/academics/subjects" },
      { title: "Exams", path: "/academics/exams" },
      { title: "Grades", path: "/academics/grades" },
      { title: "Promotions", path: "/academics/promotions" },
    ],
  },
  {
    basePath: "/attendance",
    items: [
      { title: "Students Attendance", path: "/attendance/students" },
      { title: "Staff Attendance", path: "/attendance/staff" },
    ],
  },
  {
    basePath: "/scheduling",
    items: [
      { title: "Class Schedules", path: "/scheduling/classes" },
      { title: "Teacher Schedules", path: "/scheduling/teachers" },
      { title: "Exam Schedules", path: "/scheduling/exams" },
      { title: "Holidays", path: "/scheduling/holidays" },
    ],
  },
  {
    basePath: "/finance",
    items: [
      { title: "Fees", path: "/finance/fees" },
      { title: "Payments", path: "/finance/payments" },
      { title: "Installments", path: "/finance/installments" },
      { title: "Salaries", path: "/finance/salaries" },
      { title: "Deductions", path: "/finance/deductions" },
    ],
  },
  {
    basePath: "/communication",
    items: [
      { title: "Announcements", path: "/communication/announcements" },
      { title: "Notifications", path: "/communication/notifications" },
      { title: "Complaints", path: "/communication/complaints" },
      { title: "Activities", path: "/communication/activities" },
    ],
  },
  {
    basePath: "/settings",
    items: [
      { title: "Roles", path: "/settings/roles" },
      { title: "Permissions", path: "/settings/permissions" },
      { title: "School Config", path: "/settings/school-config" },
      { title: "System Config", path: "/settings/system-config" },
    ],
  },
];

export function SubNavigation() {
  const location = useLocation();

  const currentSection = subNavigationItems.find((section) =>
    location.pathname.startsWith(section.basePath)
  );

  if (!currentSection) return null;

  return (
    <div className="border-b border-border/50 bg-background/75 px-4 py-3 backdrop-blur-xl md:px-6 lg:px-8">
      <nav className="page-shell flex items-center gap-2 overflow-x-auto">
        {currentSection.items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all",
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "bg-card/80 text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")
            }
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}