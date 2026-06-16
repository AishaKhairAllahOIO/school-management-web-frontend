import type { BaseUser } from "@/features/users/shared/types/base-user.types";
import type { CounselorUser } from "@/features/users/counselors/types/counselor.types";
import type { ParentUser } from "@/features/users/parents/types/parent.types";
import type { SecretaryUser } from "@/features/users/secretaries/types/secretary.types";
import type { ServiceStaffUser } from "@/features/users/service-staff/types/service-staff.types";
import type { StudentUser } from "@/features/users/students/types/student.types";
import type { SupervisorUser } from "@/features/users/supervisors/types/supervisor.types";
import type { TeacherUser } from "@/features/users/teachers/types/teacher.types";

type CsvColumn<TData> = {
  key: keyof TData;
  label: string;
};

const baseUserCsvColumns: CsvColumn<BaseUser>[] = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "fatherName", label: "Father Name" },
  { key: "motherName", label: "Mother Name" },
  { key: "birthDate", label: "Birth Date" },
  { key: "birthPlace", label: "Birth Place" },
  { key: "gender", label: "Gender" },
  { key: "nationality", label: "Nationality" },
  { key: "address", label: "Address" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "photoUrl", label: "Photo URL" },
  { key: "recordStatus", label: "Record Status" },
  { key: "accountStatus", label: "Account Status" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
  { key: "deletedAt", label: "Deleted At" },
];

export const studentCsvColumns: CsvColumn<StudentUser>[] = [
  ...baseUserCsvColumns,
  { key: "category", label: "Category" },
  { key: "studentCode", label: "Student Code" },
  { key: "parentId", label: "Parent ID" },
  { key: "gradeId", label: "Grade ID" },
  { key: "classroomId", label: "Classroom ID" },
];

export const teacherCsvColumns: CsvColumn<TeacherUser>[] = [
  ...baseUserCsvColumns,
  { key: "category", label: "Category" },
  { key: "teacherCode", label: "Teacher Code" },
  { key: "teacherEmail", label: "Teacher Email" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  { key: "hireDate", label: "Hire Date" },
  { key: "degree", label: "Degree" },
  { key: "specialization", label: "Specialization" },
  { key: "yearsOfExperience", label: "Years Of Experience" },
  { key: "university", label: "University" },
  { key: "graduationYear", label: "Graduation Year" },
  { key: "subject", label: "Subject" },
  { key: "department", label: "Department" },
  { key: "employmentType", label: "Employment Type" },
  { key: "status", label: "Status" },
  { key: "studyStartDate", label: "Study Start Date" },
  { key: "studyEndDate", label: "Study End Date" },
];

export const parentCsvColumns: CsvColumn<ParentUser>[] = [
  ...baseUserCsvColumns,
  { key: "category", label: "Category" },
  { key: "parentCode", label: "Parent Code" },
  { key: "occupation", label: "Occupation" },
  { key: "relation", label: "Relation" },
];

export const secretaryCsvColumns: CsvColumn<SecretaryUser>[] = [
  ...baseUserCsvColumns,
  { key: "category", label: "Category" },
  { key: "secretaryCode", label: "Secretary Code" },
  { key: "secretaryEmail", label: "Secretary Email" },
  { key: "hireDate", label: "Hire Date" },
  { key: "degree", label: "Degree" },
  { key: "specialization", label: "Specialization" },
  { key: "yearsOfExperience", label: "Years Of Experience" },
  { key: "university", label: "University" },
  { key: "graduationYear", label: "Graduation Year" },
];

export const supervisorCsvColumns: CsvColumn<SupervisorUser>[] = [
  ...baseUserCsvColumns,
  { key: "category", label: "Category" },
  { key: "supervisorCode", label: "Supervisor Code" },
  { key: "supervisorEmail", label: "Supervisor Email" },
  { key: "hireDate", label: "Hire Date" },
  { key: "degree", label: "Degree" },
  { key: "specialization", label: "Specialization" },
  { key: "yearsOfExperience", label: "Years Of Experience" },
  { key: "university", label: "University" },
  { key: "graduationYear", label: "Graduation Year" },
];

export const counselorCsvColumns: CsvColumn<CounselorUser>[] = [
  ...baseUserCsvColumns,
  { key: "category", label: "Category" },
  { key: "counselorCode", label: "Counselor Code" },
  { key: "counselorEmail", label: "Counselor Email" },
  { key: "hireDate", label: "Hire Date" },
  { key: "degree", label: "Degree" },
  { key: "specialization", label: "Specialization" },
  { key: "yearsOfExperience", label: "Years Of Experience" },
  { key: "university", label: "University" },
  { key: "graduationYear", label: "Graduation Year" },
  { key: "office", label: "Office" },
];

export const serviceStaffCsvColumns: CsvColumn<ServiceStaffUser>[] = [
  ...baseUserCsvColumns,
  { key: "category", label: "Category" },
  { key: "hireDate", label: "Hire Date" },
  { key: "jobType", label: "Job Type" },
];