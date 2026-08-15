// features/finance/pages/StudentFinancialProfilePage.tsx

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  GraduationCap,
  Printer,
  Receipt,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "@/shared/ui/button";

import { studentApi } from "../../users/students/api/student.api";
import { studentKeys } from "../../users/students/hooks/student.keys";

import { useStudentFinancialAccount } from "../hooks/useFinancialAccounts";
import { usePayments } from "../hooks/usePayments";

import { InstallmentsSection } from "../components/installments/InstallmentsSection";
import { CashierSection } from "../components/cashier/CashierSection";
import { FinanceTableSkeleton } from "../components/shared/FinanceTableSkeleton";
import { FullFinancialStatementDialog } from "../components/cashier/FullFinancialStatementDialog";
import { ProcessPaymentDialog } from "../components/cashier/ProcessPaymentDialog";

function isNotFound(error: unknown) {
  return (
    (error as { response?: { status?: number } })?.response
      ?.status === 404
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getPaymentStatusLabel(
  status: "unpaid" | "partially_paid" | "paid",
) {
  switch (status) {
    case "paid":
      return "Paid in full";
    case "partially_paid":
      return "Partially paid";
    default:
      return "Unpaid";
  }
}

export function StudentFinancialProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const [statementOpen, setStatementOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const studentQuery = useQuery({
    queryKey: studentId
      ? studentKeys.detail(studentId)
      : ["student-details", "missing"],
    queryFn: () => studentApi.getDetails(studentId!),
    enabled: Boolean(studentId),
    retry: false,
  });

  const accountQuery = useStudentFinancialAccount(
    studentId,
    Boolean(studentId),
  );

  const { processPayment } = usePayments();

  if (!studentId) {
    return <Navigate to="/finance/students" replace />;
  }

  if (studentQuery.isLoading || accountQuery.isLoading) {
    return (
      <div className="pt-6">
        <FinanceTableSkeleton />
      </div>
    );
  }

  const student = studentQuery.data?.student;
  const account = isNotFound(accountQuery.error)
    ? undefined
    : accountQuery.data;

  if (
    studentQuery.isError ||
    !student ||
    (accountQuery.isError && !isNotFound(accountQuery.error))
  ) {
    return (
      <div className="mx-auto mt-6 max-w-xl rounded-[24px] border border-destructive/15 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <WalletCards className="h-5 w-5" />
        </div>

        <h2 className="mt-4 text-[15px] font-semibold">
          Financial account unavailable
        </h2>

        <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
          The student financial information could not be loaded. Please return to the
          student accounts and try again.
        </p>

        <Button
          variant="outline"
          className="mt-5 rounded-xl"
          onClick={() => navigate("/finance/students")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Student accounts
        </Button>
      </div>
    );
  }

  const totalRequired = Number(account?.totalRequiredAmount ?? 0);
  const remaining = Number(account?.remainingBalance ?? 0);
  const paid = Math.max(0, totalRequired - remaining);
  const paidPercentage = totalRequired > 0
    ? Math.min(100, Math.max(0, (paid / totalRequired) * 100))
    : 0;

  const installments = account?.installments ?? [];
  const paidInstallments = installments.filter((item) => item.status === "paid").length;
  const overdueInstallments = installments.filter((item) => item.status === "overdue").length;
  const pendingInstallments = installments.filter((item) => item.status === "pending").length;

  const isFullyPaid = account?.paymentStatus === "paid";
  const hasBalance = remaining > 0;

  const radius = 47;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (paidPercentage / 100) * circumference;

  return (
    <div className="space-y-5 pb-10 pt-4 sm:pt-5 lg:pt-6">
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-xl"
            onClick={() => navigate("/finance/students")}
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-primary/[0.07] text-primary">
              <GraduationCap className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-[17px] font-semibold tracking-[-0.02em]">
                  {student.fullName}
                </h1>
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-[10.5px] text-muted-foreground">
                <span>{account?.academicYearName ?? "Financial account"}</span>
                {account ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{account.installmentPolicy.name}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {account && isFullyPaid ? (
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl px-3 text-[11px]"
            onClick={() => setStatementOpen(true)}
          >
            <Printer className="mr-2 h-3.5 w-3.5" />
            Print statement
          </Button>
        ) : null}
      </header>

      {!account ? (
        <section className="rounded-[24px] border border-dashed border-border/60 bg-card p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.07] text-primary">
            <WalletCards className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-[14px] font-semibold">
            No financial account yet
          </h2>

          <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
            Create a financial contract for this student to generate installments and
            start recording payments.
          </p>
        </section>
      ) : (
        <>
          {/* MAIN FINANCIAL CARD */}
          <section className="overflow-hidden rounded-[26px] border border-border/60 bg-card shadow-[0_14px_45px_rgba(31,22,73,0.05)]">
            <div className="p-5 sm:p-6 lg:p-7">
              <div className="grid gap-7 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                {/* DONUT */}
                <div className="relative mx-auto flex h-[170px] w-[170px] shrink-0 items-center justify-center lg:mx-0">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/60"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className={isFullyPaid ? "text-success" : "text-primary"}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[26px] font-semibold tracking-[-0.04em]">
                      {Math.round(paidPercentage)}%
                    </span>
                    <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      paid
                    </span>
                  </div>
                </div>

                {/* BALANCE */}
                <div className="min-w-0 text-center lg:text-start">
                  <div className="flex items-center justify-center gap-2 lg:justify-start">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                      <CircleDollarSign className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Remaining balance
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="text-[30px] font-semibold tracking-[-0.045em] text-foreground sm:text-[34px]">
                      {formatMoney(remaining)}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {isFullyPaid
                      ? "This account has been fully settled."
                      : "Amount remaining on the financial account."}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                    <div className="rounded-xl bg-muted/35 px-3 py-2">
                      <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                        Total
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold">
                        {formatMoney(totalRequired)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-success/[0.07] px-3 py-2">
                      <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                        Paid
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold text-success">
                        {formatMoney(paid)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAYMENT ACTION */}
                <div className="flex min-w-[190px] flex-col gap-3 rounded-[18px] border border-border/50 bg-muted/[0.18] p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold">Payment</p>
                      <p className="text-[9.5px] text-muted-foreground">
                        Record a new payment
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="h-9 w-full rounded-xl text-[11px]"
                    disabled={!hasBalance}
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    <CreditCard className="mr-2 h-3.5 w-3.5" />
                    Record payment
                  </Button>

                  <p className="text-center text-[9px] leading-4 text-muted-foreground">
                    {hasBalance
                      ? "Payment will be applied to this account."
                      : "No balance remaining."}
                  </p>
                </div>
              </div>
            </div>

            {/* ACCOUNT META */}
            <div className="grid border-t border-border/50 sm:grid-cols-3">
              <div className="flex items-center gap-3 border-b border-border/50 px-5 py-3.5 sm:border-b-0 sm:border-e">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/45 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                    Fee plan
                  </p>
                  <p className="truncate text-[10.5px] font-medium">
                    {account.feePlan.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-b border-border/50 px-5 py-3.5 sm:border-b-0 sm:border-e">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/45 text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                    Installments
                  </p>
                  <p className="text-[10.5px] font-medium">
                    {account.installmentPolicy.installmentsCount} payments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/45 text-muted-foreground">
                  {isFullyPaid ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Clock3 className="h-3.5 w-3.5" />
                  )}
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                    Status
                  </p>
                  <p
                    className={[
                      "text-[10.5px] font-medium",
                      isFullyPaid ? "text-success" : "text-foreground",
                    ].join(" ")}
                  >
                    {getPaymentStatusLabel(account.paymentStatus)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* INSTALLMENT MINI OVERVIEW */}
          <section className="rounded-[22px] border border-border/60 bg-card px-5 py-4 shadow-[0_8px_28px_rgba(31,22,73,0.035)] sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[12.5px] font-semibold">Payment schedule</h2>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {installments.length} scheduled installments
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/[0.07] px-2.5 py-1 text-[9px] font-medium text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  {paidInstallments} paid
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-2.5 py-1 text-[9px] font-medium text-muted-foreground">
                  <Clock3 className="h-3 w-3" />
                  {pendingInstallments} upcoming
                </span>

                {overdueInstallments > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/[0.07] px-2.5 py-1 text-[9px] font-medium text-destructive">
                    {overdueInstallments} overdue
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          {/* INSTALLMENTS */}
          <InstallmentsSection
            studentId={studentId}
            installments={account.installments}
            title="Installment Schedule"
            description="View each scheduled payment, due date, and payment status."
          />

          {/* PAYMENT HISTORY */}
          <CashierSection
            studentId={studentId}
            accountId={account.id}
            studentName={student.fullName}
            title="Payment History"
            description="Review and manage recorded payments."
          />
        </>
      )}

      {/* STATEMENT DIALOG */}
      {account ? (
        <FullFinancialStatementDialog
          open={statementOpen}
          onOpenChange={setStatementOpen}
          studentName={student.fullName}
          academicYearName={account.academicYearName}
          account={account}
        />
      ) : null}

      {/* PROCESS PAYMENT DIALOG */}
      {account && (
        <ProcessPaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          students={[{ id: studentId, name: student.fullName }]}
          initialStudentId={studentId}
          isLoading={processPayment.isPending}
          onSubmit={(values) => {
            processPayment.mutate(values, {
              onSuccess: () => {
                setPaymentDialogOpen(false);
                accountQuery.refetch();
              },
            });
          }}
        />
      )}
    </div>
  );
}