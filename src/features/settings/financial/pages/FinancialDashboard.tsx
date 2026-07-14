import { FeePlansSection } from "../sections/FeePlansSection";
import { InstallmentPoliciesSection } from "../sections/InstallmentPoliciesSection";
 
 
export const FinancialDashboard = () => {
  const academicYears = [
    { id: 1, name: "2023/2024" },
    { id: 2, name: "2024/2025" },
  ];

  const gradeLevels = [
    { id: 1, name: "Grade 1" },
    { id: 2, name: "Grade 2" },
    { id: 3, name: "Grade 3" },
  ];

  return (
    <div>
      <FeePlansSection
        academicYears={academicYears}
        gradeLevels={gradeLevels}
      />
      
       <InstallmentPoliciesSection />

    </div>
    
  );
  
};
