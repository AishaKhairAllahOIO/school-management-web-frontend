import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type {
  CreateTeacherWorkloadPayload,
  TeacherWorkload,
  UpdateTeacherWorkloadPayload,
} from "../types/teacher-workload.types";

export const teacherWorkloadApi = createMockResourceApi<
  TeacherWorkload,
  CreateTeacherWorkloadPayload,
  UpdateTeacherWorkloadPayload
>("teacherWorkloads", "workload", (payload) => ({
  assignedMonthlyPeriods: 0,
  remainingMonthlyPeriods: payload.requiredMonthlyPeriods,
}), (_id, payload) => ({
  ...(payload.requiredMonthlyPeriods !== undefined
    ? { remainingMonthlyPeriods: payload.requiredMonthlyPeriods }
    : {}),
}));
