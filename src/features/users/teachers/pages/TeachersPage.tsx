import { TeachersTable } from "@/features/users/teachers/components/TeachersTable";
import { TeachersToolbar } from "@/features/users/teachers/components/TeachersToolbar";

export function TeachersPage() {
  return (
    <div className="space-y-4">
      <TeachersToolbar />
      <TeachersTable />
    </div>
  );
}