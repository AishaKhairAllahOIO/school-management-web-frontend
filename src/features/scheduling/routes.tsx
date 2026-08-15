import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { ClassSchedulesPage } from "@/features/scheduling/class-schedules/pages/SchedulePage";
import { ExamSchedulePage } from "@/features/scheduling/exams/pages/ExamSchedulePage";
import { MarksPage } from "@/features/scheduling/marks/pages/MarksPage";

export const schedulingRoutes = [
  {
    path: "scheduling",
    children: [
      { index: true, element: <Navigate to="classes" replace /> },
      { path: "classes", element: <ClassSchedulesPage /> },
      { path: "exams", element: <ExamSchedulePage /> },
      { path: "mark", element: <MarksPage /> },
    ],
  },
] satisfies RouteObject[];
