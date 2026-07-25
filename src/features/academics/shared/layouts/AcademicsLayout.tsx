import { Outlet, useLocation } from "react-router-dom";

import { AcademicNavigation } from "../components/AcademicNavigation";

export function AcademicsLayout() {
  const location = useLocation();

  const normalizedPath = location.pathname.replace(/\/+$/, "");

  const isOverview = normalizedPath === "/academics";

  return (
    <div className={isOverview ? "min-w-0" : "min-w-0 space-y-5"}>
      {!isOverview && <AcademicNavigation />}

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}