import { useNavigate } from "react-router-dom";

import { StudentContractsSection } from "../components/StudentContractsSection";

export function StudentFinancialAccountsPage() {
  const navigate = useNavigate();

  return (
    <StudentContractsSection
      onOpenStudentAccount={(studentId) =>
        navigate(`/finance/students/${studentId}`)
      }
    />
  );
}