import type { CounselorUser } from "../../counselors/types/counselor.types";
import type { ParentUser } from "../../parents/types/parent.types";
import type { SecretaryUser } from "../../secretaries/types/secretary.types";
import type { ServiceStaffUser } from "../../service-staff/types/service-staff.types";
import type { StudentUser } from "../../students/types/student.types";
import type { SupervisorUser } from "../../supervisors/types/supervisor.types";
import type { TeacherUser } from "../../teachers/types/teacher.types";

export type User =
  | StudentUser
  | ParentUser
  | TeacherUser
  | SecretaryUser
  | SupervisorUser
  | CounselorUser
  | ServiceStaffUser;