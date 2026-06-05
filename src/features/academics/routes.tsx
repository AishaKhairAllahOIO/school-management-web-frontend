import { Navigate } from "react-router-dom";

import { GradesPage } from "@/features/academics/grades/pages/GradesPage";
import { SubjectsPage } from "@/features/academics/subjects/pages/SubjectsPage";
import { ClassroomsPage } from "@/features/academics/classrooms/pages/ClassroomsPage";
import { GradeSubjectsPage } from "@/features/academics/grade-subjects/pages/GradeSubjectsPage";
import { StudentEnrollmentsPage } from "@/features/academics/student-enrollments/pages/StudentEnrollmentsPage";
import { TeacherAssignmentsPage } from "@/features/academics/teacher-assignments/pages/TeacherAssignmentsPage";
import { GradeBookPage } from "@/features/academics/grade-book/pages/GradeBookPage";

export const academicsRoutes = {
  path: "academics",
  children: [
    { index: true, element: <Navigate to="grades" replace /> },
    { path: "grades", element: <GradesPage /> },
    { path: "subjects", element: <SubjectsPage /> },
    { path: "classrooms", element: <ClassroomsPage /> },
    { path: "grade-subjects", element: <GradeSubjectsPage /> },
    { path: "student-enrollments", element: <StudentEnrollmentsPage /> },
    { path: "teacher-assignments", element: <TeacherAssignmentsPage /> },
    { path: "grade-book", element: <GradeBookPage /> },
  ],
};