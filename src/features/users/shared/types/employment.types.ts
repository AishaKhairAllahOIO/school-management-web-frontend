export type Degree =
  | "diploma"
  | "bachelor"
  | "master"
  | "phd"
  | "other";

export type EmploymentInformation = 
{
  hireDate: string;

  degree: Degree;

  specialization: string;

  yearsOfExperience?: number;

  university: string;

  graduationYear: number;
};