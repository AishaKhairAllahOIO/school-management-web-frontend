import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { ExamSchedulesPage } from "@/features/scheduling/pages/ExamSchedulesPage";
import { HolidaysPage } from "@/features/scheduling/pages/HolidaysPage";
import { QuizSchedulesPage } from "@/features/scheduling/pages/QuizSchedulesPage";
// import { ClassSchedulesPage } from "@/features/scheduling/class-schedules/pages/ClassSchedulesPage";
// import { TeacherSchedulesPage } from "@/features/scheduling/teacher-schedules/pages/TeacherSchedulesPage";

export const schedulingRoutes = [
  {
    path: "scheduling",
    children: [
      {
        index: true,
        element: <Navigate to="classes" replace />,
      },
      {
        path: "classes",
        element: <ExamSchedulesPage />,
      },
      {
        path: "teachers",
        element: <ExamSchedulesPage />,
      },
      {
        path: "exams",
        element: <ExamSchedulesPage />,
      },
      {
        path: "quizzes",
        element: <QuizSchedulesPage />,
      },
      {
        path: "holidays",
        element: <HolidaysPage />,
      },
    ],
  },
] satisfies RouteObject[];