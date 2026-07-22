import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { AssessmentComponentsPage } from "@/features/academics/assessments/pages/AssessmentComponentsPage";
import { ClassroomsPage } from "@/features/academics/classrooms/pages/ClassroomsPage";
import { GradeConfigurationsPage } from "@/features/academics/grade-configurations/pages/GradeConfigurationsPage";
import { GradeSubjectsPage } from "@/features/academics/grade-subjects/pages/GradeSubjectsPage";
import { GradesPage } from "@/features/academics/grades/pages/GradesPage";
import { AcademicsLayout } from "@/features/academics/shared/layouts/AcademicsLayout";
import { SubjectsPage } from "@/features/academics/subjects/pages/SubjectsPage";
// import { TeacherAssignmentsPage } from "@/features/academics/teacher-assignments/pages/TeacherAssignmentsPage";
// import { TeacherWorkloadsPage } from "@/features/academics/teacher-workloads/pages/TeacherWorkloadsPage";

export const academicsRoutes = [
  {
    path: "academics",
    element: <AcademicsLayout />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="grades"
            replace
          />
        ),
      },
      {
        path: "grades",
        element: <GradesPage />,
      },
      {
        path: "grade-configurations",
        element: <GradeConfigurationsPage />,
      },
      {
        path: "classrooms",
        element: <ClassroomsPage />,
      },
      {
        path: "subjects",
        element: <SubjectsPage />,
      },
      {
        path: "grade-subjects",
        element: <GradeSubjectsPage />,
      },
      {
        path: "assessments",
        element: <AssessmentComponentsPage />,
      },
      {
        path: "teacher-workloads",
        element: <SubjectsPage />,
      },
      {
        path: "teacher-assignments",
        element: <SubjectsPage />,
      },
    ],
  },
] satisfies RouteObject[];