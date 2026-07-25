import { Outlet, useLocation } from "react-router-dom";

import { AcademicNavigation } from "../components/AcademicNavigation";

export function AcademicsLayout() {
  const location = useLocation();
  const isOverview =
    location.pathname === "/academics" ||
    location.pathname === "/academics/";

  return (
    <div className={isOverview ? "" : "space-y-5"}>
      {!isOverview ? <AcademicNavigation /> : null}

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
