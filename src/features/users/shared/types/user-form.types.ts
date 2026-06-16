import type { CounselorUser } from "@/features/users/counselors/types/counselor.types";
import type { ParentUser } from "@/features/users/parents/types/parent.types";
import type { SecretaryUser } from "@/features/users/secretaries/types/secretary.types";
import type { ServiceStaffUser } from "@/features/users/service-staff/types/service-staff.types";
import type { StudentUser } from "@/features/users/students/types/student.types";
import type { SupervisorUser } from "@/features/users/supervisors/types/supervisor.types";
import type { TeacherUser } from "@/features/users/teachers/types/teacher.types";

export type UserFormMode = "create" | "edit" | "view";

export type UserFormCategory =
  | "student"
  | "parent"
  | "teacher"
  | "secretary"
  | "supervisor"
  | "counselor"
  | "service_staff";

export type EditableUser =
  | StudentUser
  | ParentUser
  | TeacherUser
  | SecretaryUser
  | SupervisorUser
  | CounselorUser
  | ServiceStaffUser;

export type UserFormValues = Partial<EditableUser> & {
  category: UserFormCategory;
};

export type UserFormModalProps = {
  open: boolean;
  mode: UserFormMode;
  category: UserFormCategory;
  user?: EditableUser | null;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
};