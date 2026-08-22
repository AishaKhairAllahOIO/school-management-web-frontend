import { Outlet } from "react-router-dom";
import { useServerErrorLayer } from "./ServerErrorLayer";

export function AcademicsErrorLayer() {
  useServerErrorLayer();

  return <Outlet />;
}
