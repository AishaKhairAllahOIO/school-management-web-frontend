import type {
  StudentAttendance,
} from "../types/attendance.types";

export const attendanceMock: StudentAttendance[] =
[
  {
    id: "1",
    studentId: "STD001",
    studentName: "Ahmed Ali",
    className: "Grade 7",
    section: "A",
    date: "2026-02-01",
    status: "Present",
  },

  {
    id: "2",
    studentId: "STD002",
    studentName: "Sara Omar",
    className: "Grade 7",
    section: "A",
    date: "2026-02-01",
    status: "Absent",
    absenceType: "Excused",
  },

  {
    id: "3",
    studentId: "STD003",
    studentName: "Mohammad Hasan",
    className: "Grade 8",
    section: "B",
    date: "2026-02-01",
    status: "Absent",
    absenceType: "Unexcused",  
  },

   {
  id: "4",
  studentId: "STD004",
  studentName: "Ahmad Ali",
  className: "Grade 9",
  section: "B",
  date: "2026-02-15",
  status: "Absent",
  absenceType: "Excused",
   },
     {
  id: "5",
  studentId: "STD005",
  studentName: "sham sharaf",
  className: "Grade 9",
  section: "C",
  date: "2026-04-15",
  status: "Absent",
  absenceType: "Unexcused",
   },
     {
  id: "6",
  studentId: "STD006",
  studentName: "zaher ali",
  className: "Grade 9",
  section: "A",
  date: "2026-03-13",
  status: "Absent",
  absenceType: "Excused",
   },
  {
  id: "7",
  studentId: "STD007",
  studentName: "leen kasem",
  className: "Grade 8",
  section: "A",
  date: "2026-02-1",
  status: "Present",
    },
];