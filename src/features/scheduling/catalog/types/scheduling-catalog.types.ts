export type SchedulingGrade = {
  id: string;
  name: string;
  level: number;
  color: "violet" | "sky" | "mint" | "peach" | "rose";
};

export type SchedulingClassroom = {
  id: string;
  name: string;
  gradeId: string;
  roomNumber?: string | null;
  studentCount?: number;
};

export type SchedulingSubject = {
  id: string;
  name: string;
  color: "violet" | "sky" | "mint" | "peach" | "rose";
};

export type SchedulingTeacher = {
  id: string;
  name: string;
};

export type SchedulingCatalog = {
  grades: SchedulingGrade[];
  classrooms: SchedulingClassroom[];
  subjects: SchedulingSubject[];
  teachers: SchedulingTeacher[];
  academicYearId: string;
};
