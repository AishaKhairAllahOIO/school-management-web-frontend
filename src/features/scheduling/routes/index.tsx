import { Navigate } from "react-router-dom";

import { ClassSchedulesPage } from "@/features/scheduling/pages/ClassSchedulesPage";
import { ExamSchedulesPage } from "@/features/scheduling/pages/ExamSchedulesPage";
import { HolidaysPage } from "@/features/scheduling/pages/HolidaysPage";
import { QuizSchedulesPage } from "@/features/scheduling/pages/QuizSchedulesPage";

export const schedulingRoutes = {
  path: "scheduling",
  children: [
    { index: true, element: <Navigate to="classes" replace /> },
    { path: "classes", element: <ClassSchedulesPage /> },
    { path: "teachers", element: <ClassSchedulesPage /> },
    { path: "exams", element: <ExamSchedulesPage /> },
    { path: "quizzes", element: <QuizSchedulesPage /> },
    { path: "holidays", element: <HolidaysPage /> },
  ],
};