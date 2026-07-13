import { Outlet } from "react-router-dom";

import { AcademicNavigation } from "../components/AcademicNavigation";

export function AcademicsLayout() {
  return (
    <div className="space-y-6">
      <AcademicNavigation />

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
