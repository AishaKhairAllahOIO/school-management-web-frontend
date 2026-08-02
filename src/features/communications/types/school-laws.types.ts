export interface SchoolLaw {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface LawPayload {
  title: string;
  description?: string; 
}