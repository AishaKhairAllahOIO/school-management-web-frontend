
export type GradeConfiguration = {
  id: string;

  academicYearId: string;

  gradeId: string;

  supervisorId: string ;

  plannedClassroomsCount: number;//عدد الشعب (ادخال من المدير)
  
  plannedStudentsCapacity: number; //  عدد الطلاب الكلي للصف (ادخال من المدير)

  actualClassroomsCount: number;// عدد الشعب الفعلية (  حساب من الباك)


  actualStudentsCount: number;// 

  createdAt: string;
  updatedAt: string;
};

export type CreateGradeConfigurationPayload = {
  academicYearId: string;

  gradeId: string;

  supervisorId: string;

  defaultClassroomCapacity: number;

  plannedClassroomsCount: number;


};

export type UpdateGradeConfigurationPayload =
  Partial<CreateGradeConfigurationPayload>;