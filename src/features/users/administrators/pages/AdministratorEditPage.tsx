import {
  StaffEditPage,
} from "../../staff/pages/StaffEditPage";
import {
  AdministratorAccessGate,
} from "../components/AdministratorAccessGate";

export function AdministratorEditPage() {
  return (
    <AdministratorAccessGate>
      <StaffEditPage role="super_admin" />
    </AdministratorAccessGate>
  );
}
