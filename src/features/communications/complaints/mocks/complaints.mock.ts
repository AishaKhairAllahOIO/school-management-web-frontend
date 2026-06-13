import type { Complaint } from "../types/complaint.types";

export const complaintsMock: Complaint[] = [
  {
    id: "cmp-01",
    subject: "Unaddressed student absence",
    summary: "A parent reported repeated unexcused absences for the student in grade 10.",
    parentName: "Fatima Al-Sayeed",
    assignedSupervisor: "Mr. Hassan"
    ,
    category: "Behavior",
    status: "New",
    date: "May 19, 2026",
    priority: "High",
  },
  {
    id: "cmp-02",
    subject: "Fee schedule discrepancy",
    summary: "The parent is requesting clarification on the remaining installments.",
    parentName: "Omar Khaled",
    assignedSupervisor: "Ms. Noura",
    category: "Financial",
    status: "Assigned",
    date: "May 17, 2026",
    priority: "Medium",
  },
  {
    id: "cmp-03",
    subject: "Special tutoring request",
    summary: "Parent requests additional academic support for the student in science.",
    parentName: "Layla Ahmad",
    assignedSupervisor: "Ms. Rana",
    category: "Academic",
    status: "In Review",
    date: "May 14, 2026",
    priority: "Low",
  },
  {
    id: "cmp-04",
    subject: "Facility cleanliness concern",
    summary: "A parent reported the classroom restroom condition after afternoon sessions.",
    parentName: "Yousef Mansour",
    assignedSupervisor: "Mr. Adel",
    category: "General",
    status: "Resolved",
    date: "May 10, 2026",
    priority: "Low",
  },
];
