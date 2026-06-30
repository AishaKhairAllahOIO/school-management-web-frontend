import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type { Classroom, CreateClassroomPayload, UpdateClassroomPayload } from "../types/classroom.types";

export const classroomApi = createMockResourceApi<
  Classroom,
  CreateClassroomPayload,
  UpdateClassroomPayload
>("classrooms", "classroom", (payload) => ({
  name: `${payload.gradeId} Classroom`,
  currentStudentsCount: 0,
  availableSeats: payload.capacity,
}), (_id, payload) => ({
  ...(payload.capacity !== undefined ? { availableSeats: payload.capacity } : {}),
}));
