import {
  BookOpen,
  Building2,
  CalendarClock,
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
  id: "structure" | "curriculum" | "teaching";
  label: string;
  description: string;
  icon: typeof GraduationCap;
  color: {
    accent: string;
    border: string;
    header: string;
    icon: string;
    iconSurface: string;
    footer: string;
    button: string;
    buttonHover: string;
  };
  items: AcademicNavigationItem[];
};

export const academicNavigationGroups: AcademicNavigationGroup[] = [
  {
    id: "structure",
    label: "Structure",
    description: "Manage school grades, planning and classrooms.",
    icon: Building2,
    color: {
      accent: "text-primary",
      border: "border-primary/20",
      header: "bg-primary/[0.055]",
      icon: "text-primary",
      iconSurface: "bg-primary/[0.08]",
      footer: "bg-primary/[0.045]",
      button: "border-primary/25 text-primary",
      buttonHover: "hover:bg-primary/[0.07]",
    },
    items: [
      {
        label: "Grades",
        description: "Manage school grades and academic stages.",
        path: "/academics/grades",
        icon: GraduationCap,
      },
      {
        label: "Grade Configurations",
        description: "Manage grade configurations and planning settings.",
        path: "/academics/grade-configurations",
        icon: Layers3,
      },
      {
        label: "Classrooms",
        description: "Manage classrooms and their assignments.",
        path: "/academics/classrooms",
        icon: School,
      },
    ],
  },
  {
    id: "curriculum",
    label: "Curriculum",
    description: "Manage subjects, assessments and curriculum content.",
    icon: BookOpen,
    color: {
      accent: "text-info",
      border: "border-info/25",
      header: "bg-info/[0.065]",
      icon: "text-info",
      iconSurface: "bg-info/[0.09]",
      footer: "bg-info/[0.055]",
      button: "border-info/30 text-info",
      buttonHover: "hover:bg-info/[0.08]",
    },
    items: [
      {
        label: "Subjects",
        description: "Manage subjects and their details.",
        path: "/academics/subjects",
        icon: BookOpen,
      },
      {
        label: "Grade Subjects",
        description: "Assign subjects to grades and academic stages.",
        path: "/academics/grade-subjects",
        icon: Layers3,
      },
      {
        label: "Assessments",
        description: "Manage assessment components and exam settings.",
        path: "/academics/assessments",
        icon: ClipboardList,
      },
    ],
  },
  {
    id: "teaching",
    label: "Teaching",
    description: "Manage teacher planning, capacity and assignments.",
    icon: UsersRound,
    color: {
      accent: "text-success",
      border: "border-success/25",
      header: "bg-success/[0.07]",
      icon: "text-success",
      iconSurface: "bg-success/[0.1]",
      footer: "bg-success/[0.06]",
      button: "border-success/30 text-success",
      buttonHover: "hover:bg-success/[0.09]",
    },
    items: [
      {
        label: "Teacher Workloads",
        description: "Manage teacher capacity and teaching workloads.",
        path: "/academics/teacher-workloads",
        icon: UsersRound,
      },
      {
        label: "Teacher Assignments",
        description: "Assign teachers to subjects and classes.",
        path: "/academics/teacher-assignments",
        icon: UserRoundCheck,
      },
      {
        label: "Time Slots",
        description: "Manage the time slots used by school schedules.",
        path: "/academics/time-slots",
        icon: CalendarClock,
      },
    ],
  },
];
