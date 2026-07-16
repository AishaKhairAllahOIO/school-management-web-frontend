import { ContractsSection } from "../components/contracts/ContractsSection";
import { InstallmentsSection } from "../components/installments/InstallmentsSection"; // 👈 استيراد
import { CashierSection } from "../components/cashier/CashierSection";

export const FinanceOperationsPage = () => {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Finance Operations
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Manage student financial contracts, monitor installment schedules, and process cashier payments.
        </p>
      </div>

      <hr className="border-border/50" />

      <div className="flex flex-col gap-10">
        
        {/* 1. قسم العقود */}
        <section>
          <ContractsSection />
        </section>

        {/* 2. قسم الأقساط المجدولة */}
        <section>
          <InstallmentsSection />
        </section>

        {/* 3. قسم الكاشير والدفعات */}
        <section>
          <CashierSection />
        </section>

      </div>
    </div>
  );
}