import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export function UsersRouteScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const mainScroller = document.querySelector<HTMLElement>(
      "main, [data-scroll-container], [data-radix-scroll-area-viewport]",
    );

    if (mainScroller && mainScroller.scrollTop > 0) {
      mainScroller.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  return <Outlet />;
}
