export type ExamType = "exam" | "quiz";

export interface ExamTeacher {
  staff_id: number;
  teacher_id: number;
  teacher_name: string;
}

export interface ExamSubject {
  exam_subject_id: number;
  grade_subject_id: number;
  subject_id: number | null;
  subject_name: string;

  exam_date: string;
  start_time: string;
  end_time: string;

  syllabus: string | null;

  teachers: ExamTeacher[];
}

export interface AdminExam {
  exam_id: number;

  title: string;

  type: ExamType;

  grade_level: {
    id: number;
    name: string;
  };

  semester: {
    id: number;
    name: string;
  };

  academic_year_id: number;

  subjects: ExamSubject[];
}

export interface ExamSetupSubject {
  grade_subject_id: number;

  subject_name: string;

  auto_teachers: {
    teacher_id: number;
    teacher_name: string;
  }[];
}

export interface ExamFormSubject {
  grade_subject_id: number | "";

  exam_date: string;

  start_time: string;

  end_time: string;

  syllabus: string;

  teacher_ids: number[];
}

export interface ExamFormData {
  title: string;

  type: ExamType;

  grade_level_id: number | "";

  subjects: ExamFormSubject[];
}
