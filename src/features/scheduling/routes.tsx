import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { ClassSchedulesPage } from "@/features/scheduling/class-schedules/pages/ClassSchedulesPage";
import { ExamSchedulesPage } from "@/features/scheduling/pages/ExamSchedulesPage";
import { QuizSchedulesPage } from "@/features/scheduling/pages/QuizSchedulesPage";

export const schedulingRoutes = [
  {
    path: "scheduling",
    children: [
      { index: true, element: <Navigate to="classes" replace /> },
      { path: "classes", element: <ClassSchedulesPage /> },
      { path: "exams", element: <ExamSchedulesPage /> },
      { path: "quizzes", element: <QuizSchedulesPage /> },
    ],
  },
] satisfies RouteObject[];
