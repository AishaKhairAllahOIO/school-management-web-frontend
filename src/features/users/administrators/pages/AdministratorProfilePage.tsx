import {
  StaffProfilePage,
} from "../../staff/pages/StaffProfilePage";
import {
  AdministratorAccessGate,
} from "../components/AdministratorAccessGate";

export function AdministratorProfilePage() {
  return (
    <AdministratorAccessGate>
      <StaffProfilePage role="super_admin" />
    </AdministratorAccessGate>
  );
}
