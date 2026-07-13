import {
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Layers3,
  School,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

export type AcademicNavigationItem = {
  label: string;
  description: string;
  path: string;
  icon: typeof GraduationCap;
};

export type AcademicNavigationGroup = {
  id: "structure" | "curriculum" | "teaching" | "enrollment";
  label: string;
  description: string;
  icon: typeof GraduationCap;
  items: AcademicNavigationItem[];
};

export const academicNavigationGroups: AcademicNavigationGroup[] = [
  {
    id: "structure",
    label: "Structure",
    description: "Grades, planning and classrooms",
    icon: Building2,
    items: [
      {
        label: "Grades",
        description: "Manage grade levels",
        path: "/academics/grades",
        icon: GraduationCap,
      },
      {
        label: "Grade Configurations",
        description: "Plan grade capacity",
        path: "/academics/grade-configurations",
        icon: Layers3,
      },
      {
        label: "Classrooms",
        description: "Manage classrooms",
        path: "/academics/classrooms",
        icon: School,
      },
    ],
  },
  {
    id: "curriculum",
    label: "Curriculum",
    description: "Subjects and assessments",
    icon: BookOpen,
    items: [
      {
        label: "Subjects",
        description: "Manage subjects",
        path: "/academics/subjects",
        icon: BookOpen,
      },
      {
        label: "Grade Subjects",
        description: "Connect subjects to grades",
        path: "/academics/grade-subjects",
        icon: Layers3,
      },
      {
        label: "Assessments",
        description: "Manage assessment components",
        path: "/academics/assessments",
        icon: ClipboardList,
      },
    ],
  },
  {
    id: "teaching",
    label: "Teaching",
    description: "Teacher planning and assignment",
    icon: UsersRound,
    items: [
      {
        label: "Teacher Workloads",
        description: "Manage teaching capacity",
        path: "/academics/teacher-workloads",
        icon: UsersRound,
      },
      {
        label: "Teacher Assignments",
        description: "Assign teachers to classes",
        path: "/academics/teacher-assignments",
        icon: UserRoundCheck,
      },
    ],
  },
  {
    id: "enrollment",
    label: "Enrollment",
    description: "Student academic placement",
    icon: UserRoundCheck,
    items: [
      {
        label: "Student Enrollments",
        description: "Manage student enrollment",
        path: "/academics/student-enrollments",
        icon: UserRoundCheck,
      },
    ],
  },
];
