import { Navigate } from "react-router-dom";

/* Dashboard */
import { dashboardRoutes } from "@/features/dashboard/routes";

/* Users */
import { StudentsPage } from "@/features/users/students/pages/StudentsPage";
import { TeachersPage } from "@/features/users/teachers/pages/TeachersPage";
import { ParentsPage } from "@/features/users/parents/pages/ParentsPage";

/* Academics */
import { GradesPage } from "@/features/academics/grades/pages/GradesPage";
import { SubjectsPage } from "@/features/academics/subjects/pages/SubjectsPage";
import { ClassroomsPage } from "@/features/academics/classrooms/pages/ClassroomsPage";
import { GradeSubjectsPage } from "@/features/academics/grade-subjects/pages/GradeSubjectsPage";
import { StudentEnrollmentsPage } from "@/features/academics/student-enrollments/pages/StudentEnrollmentsPage";
import { TeacherAssignmentsPage } from "@/features/academics/teacher-assignments/pages/TeacherAssignmentsPage";
import { GradeBookPage } from "@/features/academics/grade-book/pages/GradeBookPage";

/* Attendance */
import { StudentAttendancePage } from "@/features/attendance/students/pages/StudentAttendancePage";
import { StaffAttendancePage } from "@/features/attendance/staff/pages/StaffAttendancePage";
import { LeaveRequestsPage } from "@/features/attendance/Leave Requests/pages/LeaveRequestsPage";

/* Scheduling */
// import { schedulingRoutes } from "@/features/scheduling/routes";

/* Reports */
import { reportsRoutes } from "@/features/reports/routes";

/* Settings */
import { RolesPage } from "@/features/settings/roles/pages/RolesPage";
import { PermissionsPage } from "@/features/settings/permissions/pages/PermissionsPage";
import { GeneralSettingsPage } from "@/features/settings/general/pages/GeneralSettingsPage";
import { AcademicSettingsPage } from "@/features/settings/academic/pages/AcademicSettingsPage";
import { SecuritySettingsPage } from "@/features/settings/security/pages/SecuritySettingsPage";

function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-3xl bg-card p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-foreground">
        {title}
      </h1>

      <p className="mt-2 text-muted-foreground">
        This page content appears inside the dashboard container.
      </p>
    </div>
  );
}

export const appRoutes = [
  ...dashboardRoutes,

  /* -------------------------------------------------------------------------- */
  /* Users                                                                       */
  /* -------------------------------------------------------------------------- */

  {
    path: "users",
    children: [
      { index: true, element: <Navigate to="students" replace /> },

      { path: "students", element: <StudentsPage /> },
      { path: "teachers", element: <TeachersPage /> },
      { path: "parents", element: <ParentsPage /> },

      {
        path: "secretaries",
        element: <PlaceholderPage title="Secretaries" />,
      },
      {
        path: "supervisors",
        element: <PlaceholderPage title="Supervisors" />,
      },
      {
        path: "counselors",
        element: <PlaceholderPage title="Counselors" />,
      },
      {
        path: "service-staff",
        element: <PlaceholderPage title="Service Staff" />,
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Academics                                                                   */
  /* -------------------------------------------------------------------------- */

  {
    path: "academics",
    children: [
      { index: true, element: <Navigate to="grades" replace /> },

      { path: "grades", element: <GradesPage /> },

      { path: "subjects", element: <SubjectsPage /> },

      { path: "classrooms", element: <ClassroomsPage /> },

      {
        path: "grade-subjects",
        element: <GradeSubjectsPage />,
      },

      {
        path: "student-enrollments",
        element: <StudentEnrollmentsPage />,
      },

      {
        path: "teacher-assignments",
        element: <TeacherAssignmentsPage />,
      },

      {
        path: "grade-book",
        element: <GradeBookPage />,
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Attendance                                                                  */
  /* -------------------------------------------------------------------------- */

  {
    path: "attendance",
    children: [
      { index: true, element: <Navigate to="students" replace /> },

      {
        path: "students",
        element: <StudentAttendancePage />,
      },

      {
        path: "staff",
        element: <StaffAttendancePage />,
      },

      {
        path: "vacations",
        element: <LeaveRequestsPage />,
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Scheduling                                                                  */
  /* -------------------------------------------------------------------------- */

  // schedulingRoutes,

  /* -------------------------------------------------------------------------- */
  /* Reports                                                                     */
  /* -------------------------------------------------------------------------- */

  reportsRoutes,

  /* -------------------------------------------------------------------------- */
  /* Finance                                                                     */
  /* -------------------------------------------------------------------------- */

  {
    path: "finance",
    children: [
      { index: true, element: <Navigate to="fees" replace /> },

      { path: "fees", element: <PlaceholderPage title="Fees" /> },
      { path: "payments", element: <PlaceholderPage title="Payments" /> },
      {
        path: "installments",
        element: <PlaceholderPage title="Installments" />,
      },
      { path: "salaries", element: <PlaceholderPage title="Salaries" /> },
      {
        path: "deductions",
        element: <PlaceholderPage title="Deductions" />,
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* Settings                                                                    */
  /* -------------------------------------------------------------------------- */

  {
    path: "settings",
    children: [
      { index: true, element: <Navigate to="general" replace /> },

      {
        path: "general",
        element: <GeneralSettingsPage />,
      },

      {
        path: "academic",
        element: <AcademicSettingsPage />,
      },

      {
        path: "security",
        element: <SecuritySettingsPage />,
      },

      {
        path: "roles",
        element: <RolesPage />,
      },

      {
        path: "permissions",
        element: <PermissionsPage />,
      },
    ],
  },
];