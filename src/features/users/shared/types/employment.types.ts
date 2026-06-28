export type Degree =
  | "diploma"
  | "bachelor"
  | "master"
  | "phd"
  | "other";

export type EmploymentInformation = 
{
  email: string;
  
  hireDate: string;

  degree: Degree;

  specialization: string;

  yearsOfExperience?: number;

  university: string;

  graduationYear: string;
  
};