import { ParentsTable } from "@/features/users/parents/components/ParentsTable";
import { ParentsToolbar } from "@/features/users/parents/components/ParentsToolbar";

export function ParentsPage() {
  return (
    <div className="space-y-4">
      <ParentsToolbar />
      <ParentsTable />
    </div>
  );
}