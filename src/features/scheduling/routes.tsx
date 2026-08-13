import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { ScheduleGenerationPage } from "@/features/scheduling/class-schedules/pages/ScheduleGenerationPage";
import { ExamSchedulesPage } from "@/features/scheduling/pages/ExamSchedulesPage";
import { QuizSchedulesPage } from "@/features/scheduling/pages/QuizSchedulesPage";

export const schedulingRoutes = [
  {
    path: "scheduling",
    children: [
      { index: true, element: <Navigate to="classes" replace /> },
      { path: "classes", element: <ScheduleGenerationPage /> },
      { path: "exams", element: <ExamSchedulesPage /> },
      { path: "quizzes", element: <QuizSchedulesPage /> },
    ],
  },
] satisfies RouteObject[];
