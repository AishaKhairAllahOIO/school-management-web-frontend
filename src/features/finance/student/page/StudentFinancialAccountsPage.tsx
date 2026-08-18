import { useNavigate } from "react-router-dom";

import { ContractsSection } from "../components/ContractsSection";

export function StudentFinancialAccountsPage() {
  const navigate = useNavigate();

  return (
    <ContractsSection
      onOpenStudentAccount={(studentId) =>
        navigate(`/finance/students/${studentId}`)
      }
    />
  );
}