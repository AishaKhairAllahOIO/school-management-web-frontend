export type ComplaintStatus = "New" | "In Review" | "Assigned" | "Resolved";
export type ComplaintCategory = "Academic" | "Behavior" | "Financial" | "General";

export type Complaint = {
  id: string;
  subject: string;
  summary: string;
  parentName: string;
  assignedSupervisor: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  date: string;
  priority: "Low" | "Medium" | "High";
};
