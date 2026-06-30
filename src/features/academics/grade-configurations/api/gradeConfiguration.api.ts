import { createMockResourceApi } from "../../shared/api/mockAcademicsStore";
import type {
  CreateGradeConfigurationPayload,
  GradeConfiguration,
  UpdateGradeConfigurationPayload,
} from "../types/grade-configuration.types";

export const gradeConfigurationApi = createMockResourceApi<
  GradeConfiguration,
  CreateGradeConfigurationPayload,
  UpdateGradeConfigurationPayload
>("gradeConfigurations", "grade-config", (payload) => ({
  plannedStudentsCapacity: payload.plannedClassroomsCount * 30,
  actualClassroomsCount: 0,
  actualStudentsCount: 0,
}));
