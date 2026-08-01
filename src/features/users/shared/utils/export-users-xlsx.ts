import * as XLSX from "xlsx";

import type { StudentListItem } from "../../students/types/student.types";
import type { StaffProfile } from "../../staff/types/staff.types";

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function downloadWorkbook(
  rows: Array<Record<string, string | number | boolean | null>>,
  sheetName: string,
  fileName: string,
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.min(
      34,
      Math.max(
        key.length + 2,
        ...rows.map((row) => String(row[key] ?? "").length + 2),
      ),
    ),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, fileName, {
    compression: true,
  });
}

export function exportStudentsToExcel(
  students: StudentListItem[],
  fileName = "students.xlsx",
) {
  const rows = students.map((student) => ({
    "Enrollment ID": String(student.enrollmentId),
    "Student ID": String(student.studentId),
    "Full Name": student.fullName,
    Grade: student.grade?.name ?? "",
    Classroom: student.classroom?.name ?? "",
    "Enrollment Status": String(student.status ?? ""),
    "Account Status": String(student.accountStatus ?? ""),
    Phone: student.phoneNumber ?? "",
    Deleted: Boolean(student.isDeleted || student.deletedAt),
  }));

  downloadWorkbook(
    rows,
    "Students",
    sanitizeFileName(fileName.replace(/\.xlsx$/i, "")) + ".xlsx",
  );
}

export function exportStaffToExcel(
  staff: StaffProfile[],
  roleLabel: string,
) {
  const rows = staff.map((item) => ({
    "Staff ID": String(item.id),
    "Full Name": item.fullName,
    Role: item.role ?? roleLabel,
    Phone: item.phoneNumber ?? "",
    Email: item.email ?? "",
    Gender: item.gender ?? "",
    Nationality: item.nationality ?? "",
    Degree: item.degree ?? "",
    Specialization: item.specialization ?? "",
    University: item.university ?? "",
    "Hire Date": item.hireDate ?? "",
    "Experience Years": item.experienceYears ?? "",
    "Account Status": item.accountStatus ?? "",
    Deleted: Boolean(item.isDeleted),
  }));

  downloadWorkbook(
    rows,
    roleLabel.slice(0, 31),
    `${sanitizeFileName(roleLabel)}.xlsx`,
  );
}
