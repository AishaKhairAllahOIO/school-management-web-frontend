import {
  StaffRolePage,
} from "../../staff/pages/StaffRolePage";
import {
  AdministratorAccessGate,
} from "../components/AdministratorAccessGate";

export function AdministratorsPage() {
  return (
    <AdministratorAccessGate>
      <StaffRolePage
        role="super_admin"
        allowImport={false}
      />
    </AdministratorAccessGate>
  );
}
