import { useLocation, Navigate } from "react-router-dom";
import { ContractsSection } from "../components/contracts/ContractsSection";
import { InstallmentsSection } from "../components/installments/InstallmentsSection";
import { CashierSection } from "../components/cashier/CashierSection";

export const FinanceOperationsPage = () => {
  const { pathname } = useLocation();
  if (pathname === "/finance") return <Navigate to="/finance/contracts" replace />;
  return <div className="animate-in fade-in duration-300">
    {pathname.startsWith("/finance/installments") ? <InstallmentsSection /> : pathname.startsWith("/finance/payments") ? <CashierSection /> : <ContractsSection />}
  </div>;
};
