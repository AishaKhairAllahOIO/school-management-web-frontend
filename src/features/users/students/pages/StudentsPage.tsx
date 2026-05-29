import { StudentsTable } from "@/features/users/students/components/StudentsTable";
import { StudentsToolbar } from "@/features/users/students/components/StudentsToolbar";

export function StudentsPage() {
  return (
    <div className="space-y-4">
      <StudentsToolbar />
      <StudentsTable />
    </div>
  );
}