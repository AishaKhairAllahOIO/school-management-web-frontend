import { useNavigate } from "react-router-dom";

import { ContractsSection } from "../components/contracts/ContractsSection";

export function StudentFinancialAccountsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 pt-4 sm:pt-5 lg:pt-6">
      <ContractsSection
        title="Student Financial Accounts"
        description="Review each student's complete financial position and open one account to manage its contract, installments, and payments."
        onOpenStudentAccount={(studentId) =>
          navigate(`/finance/students/${studentId}`)
        }
      />
    </div>
  );
}
