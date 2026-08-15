export interface MarkValue {
  mark: number | null;
  notes: string | null;
  teacher_id?: number | null;
}

export interface MarkColumn {
  id: number;
  name: string;
  type: string;
  max_mark: number;
}

export interface MarkStudent {
  enrollment_id: number;
  student_id: number;
  student_name: string;
  marks: Record<string, MarkValue>;
}

export interface MarkSubjectInfo {
  grade_subject_id: number;
  subject_id: number;
  subject_name: string | null;
}

export interface MarkSubject {
  subject_info: MarkSubjectInfo;
  columns: MarkColumn[];
  students: MarkStudent[];
}

export interface MarkClassRoom {
  class_room: {
    id: number;
    name: string;
  };
  subjects: MarkSubject[];
}

export interface MarkGrade {
  id: number;
  name: string;
  classes: MarkClassRoom[];
}

export interface AllMarksResponse {
  academic_year_id: number;
  semester_id: number;
  grades: MarkGrade[];
}
