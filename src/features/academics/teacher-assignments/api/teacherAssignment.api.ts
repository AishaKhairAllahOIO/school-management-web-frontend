import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type { TeacherAssignment, CreateTeacherAssignmentPayload, UpdateTeacherAssignmentPayload } from "../types/teacher-assignment.types";

export const teacherAssignmentApi = createMockResourceApi<TeacherAssignment, CreateTeacherAssignmentPayload, UpdateTeacherAssignmentPayload>(
  "teacherAssignments",
  "assignment"
);
