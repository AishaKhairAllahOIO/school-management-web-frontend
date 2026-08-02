import {
  StaffRegistrationPage,
} from "../../staff/pages/StaffRegistrationPage";
import {
  AdministratorAccessGate,
} from "../components/AdministratorAccessGate";

export function AdministratorRegistrationPage() {
  return (
    <AdministratorAccessGate>
      <StaffRegistrationPage role="super_admin" />
    </AdministratorAccessGate>
  );
}
