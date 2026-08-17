import {
  GraduationCap,
  UsersRound,
  BriefcaseBusiness,
  School,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";

export const dashboardIcons = {
  students: GraduationCap,
  teachers: UsersRound,
  staff: BriefcaseBusiness,
  grades: School,
  attendance: ClipboardList,
  warning: AlertTriangle,
} as const;