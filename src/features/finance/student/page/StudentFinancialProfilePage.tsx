// features/finance/pages/StudentFinancialProfilePage.tsx

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CircleDollarSign,
  CreditCard,
  FileText,
  GraduationCap,
  Printer,
  WalletCards,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/shared/ui/button";

import { studentApi } from "../../../users/students/api/student.api";
import { studentKeys } from "../../../users/students/hooks/student.keys";

import {
  useFinanceAccounts,
  useStudentFinancialAccount,
} from "../hooks/useFinancialAccounts";
import { useFinancePayments } from "../hooks/usePayments";
import { useStudentInstallments } from "../hooks/useInstallments";
import { InstallmentsSection } from "../components/InstallmentsSection";
import { FinanceTableSkeleton } from "../components/FinanceTableSkeleton";
import {
  CashierSection,
  FullFinancialStatementDialog,
  ProcessPaymentDialog,
} from "../components/PaymentProcess";
import { FinalizeContractDialog } from "../components/FinalizeContractDialog";
import { UpdateContractDialog } from "../components/UpdateContractDialog";

import { useFeePlans } from "@/features/settings/financial/hooks/useFeePlans";
import { useInstallmentPolicies } from "@/features/settings/financial/hooks/useInstallmentPolicies";

function isNotFound(error: unknown) {
  return (
    (error as { response?: { status?: number } })?.response?.status === 404
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function resolveAcademicYearId(student: unknown): number | undefined {
  if (!student || typeof student !== "object") return undefined;
  const value = student as {
    academicYearId?: unknown;
    enrollment?: { academicYearId?: unknown } | null;
    activeEnrollment?: { academicYearId?: unknown } | null;
  };
  const raw =
    value.enrollment?.academicYearId ??
    value.activeEnrollment?.academicYearId ??
    value.academicYearId;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

function getPaymentProgressColor(percentage: number) {
  const value = Math.min(100, Math.max(0, percentage));

  const stops = [
    {
      position: 0,
      color: [239, 68, 68],
    },
    {
      position: 50,
      color: [245, 158, 11],
    },
    {
      position: 100,
      color: [34, 197, 94],
    },
  ];

  const upperIndex = stops.findIndex(
    (stop) => value <= stop.position,
  );

  if (upperIndex <= 0) {
    return `rgb(${stops[0].color.join(", ")})`;
  }

  const lower = stops[upperIndex - 1];
  const upper = stops[upperIndex];

  const progress =
    (value - lower.position) /
    (upper.position - lower.position);

  const color = lower.color.map((channel, index) =>
    Math.round(
      channel +
        (upper.color[index] - channel) * progress,
    ),
  );

  return `rgb(${color.join(", ")})`;
}

export function StudentFinancialProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const [statementOpen, setStatementOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [createContractOpen, setCreateContractOpen] = useState(false);
  const [updateContractOpen, setUpdateContractOpen] = useState(false);

  const { finalizeContract, updateContract } =
    useFinanceAccounts();

  const { data: feePlans = [] } = useFeePlans();
  const { data: installmentPolicies = [] } =
    useInstallmentPolicies();

  const studentQuery = useQuery({
    queryKey: studentId
      ? studentKeys.detail(studentId)
      : ["student-details", "missing"],
    queryFn: () => studentApi.getDetails(studentId!),
    enabled: Boolean(studentId),
    retry: false,
  });

  // 🔍 جلب الحساب المالي للطالب
  const accountQuery = useStudentFinancialAccount(
    studentId,
    Boolean(studentId),
  );

  const account = isNotFound(accountQuery.error)
    ? undefined
    : accountQuery.data;

  // ✅ جلب الأقساط الخاصة بالحساب (من الـ API المخصص)
  const {
    data: accountInstallments = [],
    refetch: refetchInstallments,
    isLoading: isLoadingInstallments,
    isFetching: isFetchingInstallments,
  } = useStudentInstallments(
    studentId,
    Boolean(account?.id && !isNotFound(accountQuery.error) && account?.paymentStatus !== 'draft'),
  );

  const { processPayment, data: allPayments = [] } = useFinancePayments();

  // ✅ التحقق من وجود مدفوعات لهذا الطالب
  const hasPayments = useMemo(() => {
    if (!account) return false;
    return allPayments.some(
      (payment) =>
        String(payment.studentId) === String(studentId) ||
        String(payment.accountId) === String(account.id),
    );
  }, [allPayments, account, studentId]);

  // ✅ هل الحساب في حالة draft؟
  const isDraft = account?.paymentStatus === "draft";

  // ✅ عند تغيير الحساب (بعد create/update) أو عند تغيير حالة الدفع
  // نعيد جلب الأقساط لتحديث الجدول
  useEffect(() => {
    if (account?.id && !isDraft) {
      void refetchInstallments();
    }
  }, [account?.id, isDraft, refetchInstallments]);

  // ✅ بعد كل عملية دفع ناجحة، نحدث الأقساط
  useEffect(() => {
    if (account?.id && !isDraft && hasPayments) {
      void refetchInstallments();
    }
  }, [hasPayments, account?.id, isDraft, refetchInstallments]);

  if (!studentId) {
    return (
      <Navigate
        to="/finance/students"
        replace
      />
    );
  }

  if (
    studentQuery.isLoading ||
    accountQuery.isLoading
  ) {
    return (
      <div className="pt-0">
        <FinanceTableSkeleton />
      </div>
    );
  }

  const student = studentQuery.data?.student;

  if (
    studentQuery.isError ||
    !student ||
    (accountQuery.isError &&
      !isNotFound(accountQuery.error))
  ) {
    return (
      <div className="mx-auto mt-3 max-w-xl rounded-[22px] border border-destructive/15 bg-card p-6 text-center shadow-sm sm:mt-4 sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <WalletCards className="h-5 w-5" />
        </div>

        <h2 className="mt-4 text-[15px] font-semibold">
          Financial account unavailable
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-muted-foreground">
          The student financial information could not
          be loaded. Please return to the student
          accounts and try again.
        </p>

        <Button
          variant="outline"
          className="mt-5 rounded-xl"
          onClick={() =>
            navigate("/finance/students")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
          Student accounts
        </Button>
      </div>
    );
  }

  const totalRequired = Number(
    account?.totalRequiredAmount ?? 0,
  );

  const remaining = Number(
    account?.remainingBalance ?? 0,
  );

  const paid = Math.max(
    0,
    totalRequired - remaining,
  );

  const paidPercentage =
    totalRequired > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (paid / totalRequired) * 100,
          ),
        )
      : 0;

  const effectivePaymentStatus =
    account?.paymentStatus ?? "draft";

  const isFullyPaid =
    effectivePaymentStatus === "fully_paid";

  const hasBalance = remaining > 0;

  const radius = 47;
  const circumference = 2 * Math.PI * radius;

  const dashOffset =
    circumference -
    (paidPercentage / 100) * circumference;

  const paymentProgressColor =
    getPaymentProgressColor(paidPercentage);

  return (
    <div className="space-y-3 pb-8 pt-0">
      {!account ? (
        <>
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              className="h-8 rounded-lg px-1.5 text-[11px] text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              onClick={() =>
                navigate("/finance/students")
              }
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5 rtl:rotate-180" />
              Back to student accounts
            </Button>
          </div>

          <section className="rounded-[22px] border border-dashed border-border/60 bg-card p-7 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.07] text-primary">
              <WalletCards className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-[14px] font-semibold">
              No active financial contract
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-muted-foreground">
              This student's financial profile is
              still in draft. Create the contract here
              to activate the account and its payment
              schedule.
            </p>

            <Button
              type="button"
              className="mt-5 h-9 rounded-xl px-3 text-[11px]"
              onClick={() =>
                setCreateContractOpen(true)
              }
            >
              Create contract
            </Button>
          </section>
        </>
      ) : (
        <>
          <section className="overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-[0_10px_30px_rgba(31,22,73,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border/50 px-3.5 py-2.5 sm:px-5 sm:py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary/[0.07] text-primary">
                  <GraduationCap
                    className="h-3.5 w-3.5"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-[14px] font-semibold tracking-[-0.02em]">
                    {student.fullName}
                  </h1>

                  <p className="mt-0.5 text-[9px] text-muted-foreground">
                    Student financial account
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-7 rounded-lg bg-transparent px-1.5 text-[10px] text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
                  onClick={() => navigate("/finance/students")}
                >
                  <ArrowLeft className="mr-1 h-3 w-3 rtl:rotate-180" />
                  Back
                </Button>

                {isFullyPaid ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-7 rounded-lg px-2 text-[10px]"
                    onClick={() => setStatementOpen(true)}
                  >
                    <Printer className="mr-1 h-3 w-3" />
                    Print
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="p-2.5 sm:p-3.5 lg:p-4">
              <div className="grid gap-3 sm:gap-4 lg:grid-cols-[125px_minmax(0,1fr)_205px] lg:items-center">
                <div className="relative mx-auto flex h-[135px] w-[135px] shrink-0 items-center justify-center sm:h-[145px] sm:w-[145px] lg:mx-0 lg:h-[135px] lg:w-[135px]">
                  <svg
                    viewBox="0 0 120 120"
                    className="h-full w-full -rotate-90"
                  >
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
                      stroke={paymentProgressColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className="transition-[stroke-dashoffset,stroke] duration-700 ease-out"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[22px] font-semibold tracking-[-0.04em]">
                      {Math.round(paidPercentage)}%
                    </span>

                    <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      paid
                    </span>
                  </div>
                </div>

                <div className="min-w-0 text-center lg:text-start">
                  <div className="flex items-center justify-center gap-1.5 lg:justify-start">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                      <CircleDollarSign className="h-3 w-3" />
                    </span>

                    <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Remaining balance
                    </span>
                  </div>

                  <div className="mt-1">
                    <span className="text-[25px] font-semibold tracking-[-0.045em] text-foreground sm:text-[29px]">
                      {formatMoney(remaining)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {isFullyPaid
                      ? "This account has been fully settled."
                      : "Amount remaining on the financial account."}
                  </p>

                  <div className="mt-2 flex flex-wrap justify-center gap-1.5 lg:justify-start">
                    <div className="rounded-lg bg-muted/35 px-2.5 py-1.5">
                      <p className="text-[8px] uppercase tracking-[0.08em] text-muted-foreground">
                        Total
                      </p>

                      <p className="mt-0.5 text-[10.5px] font-semibold">
                        {formatMoney(totalRequired)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-success/[0.07] px-2.5 py-1.5">
                      <p className="text-[8px] uppercase tracking-[0.08em] text-muted-foreground">
                        Paid
                      </p>

                      <p className="mt-0.5 text-[10.5px] font-semibold text-success">
                        {formatMoney(paid)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-1.5 rounded-[16px] border border-border/50 bg-muted/[0.18] p-2.5 sm:p-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                      <FileText className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10.5px] font-semibold">
                        Account actions
                      </p>

                      <p className="text-[8.5px] text-muted-foreground">
                        Contract and payment management
                      </p>
                    </div>
                  </div>

                  {isDraft ? (
                    <Button
                      type="button"
                      className="h-8 w-full rounded-lg text-[10.5px]"
                      onClick={() => setCreateContractOpen(true)}
                    >
                      <FileText className="mr-1.5 h-3 w-3" />
                      Create Contract
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 w-full rounded-lg text-[10.5px]"
                      disabled={hasPayments}
                      onClick={() => setUpdateContractOpen(true)}
                    >
                      <FileText className="mr-1.5 h-3 w-3" />
                      {hasPayments ? "Contract Locked" : "Update Contract"}
                    </Button>
                  )}

                  {hasPayments && (
                    <p className="text-center text-[8.5px] leading-3.5 text-destructive">
                      Cannot update contract after payments are recorded
                    </p>
                  )}

                  <Button
                    type="button"
                    className="h-8 w-full rounded-lg text-[10.5px]"
                    disabled={!hasBalance || isDraft}
                    onClick={() =>
                      setPaymentDialogOpen(true)
                    }
                  >
                    <CreditCard className="mr-1.5 h-3 w-3" />
                    Record payment
                  </Button>

                  <p className="text-center text-[8.5px] leading-3.5 text-muted-foreground">
                    {isDraft
                      ? "Create contract first to record payments."
                      : hasBalance
                        ? "Payment will be applied to this account."
                        : "No balance remaining."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ✅ عرض الأقساط الخاصة بالطالب مع تحديث تلقائي */}
          <InstallmentsSection
            installments={accountInstallments}
            isLoading={isLoadingInstallments || isFetchingInstallments}
            title="Installment Schedule"
            description="View each scheduled payment, due date, and payment status."
          />

          <CashierSection
            studentId={studentId}
            accountId={account.id}
            studentName={student.fullName}
            title="Payment History"
            description="Review and manage recorded payments."
          />
        </>
      )}

      {account ? (
        <FullFinancialStatementDialog
          open={statementOpen}
          onOpenChange={setStatementOpen}
          studentName={student.fullName}
          academicYearName={undefined}
          account={account}
        />
      ) : null}

      {account && !isDraft ? (
        <ProcessPaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          students={[
            {
              id: studentId,
              name: student.fullName,
            },
          ]}
          initialStudentId={studentId}
          isLoading={processPayment.isPending}
          onSubmit={(values) => {
            processPayment.mutate(values, {
              onSuccess: () => {
                setPaymentDialogOpen(false);
                // ✅ تحديث الحساب والأقساط بعد الدفع
                void accountQuery.refetch();
                // ✅ إعادة جلب الأقساط لتحديث الحالات والمبالغ
                setTimeout(() => {
                  void refetchInstallments();
                }, 500);
              },
            });
          }}
        />
      ) : null}

      {(!account || isDraft) ? (
        <FinalizeContractDialog
          open={createContractOpen}
          onOpenChange={setCreateContractOpen}
          students={[
            {
              id: studentId,
              enrollmentId: studentId,
              name: student.fullName,
            },
          ]}
          feePlans={feePlans}
          installmentPolicies={installmentPolicies}
          isLoading={finalizeContract.isPending}
          profileMode
          backgroundStudentId={Number(studentId)}
          backgroundAcademicYearId={resolveAcademicYearId(student)}
          onSubmit={(values) => {
            const academicYearId =
              resolveAcademicYearId(student) ??
              Number(values.academicYearId);

            finalizeContract.mutate(
              {
                studentId: Number(studentId),
                academicYearId,
                feePlanId: Number(values.feePlanId),
                installmentPolicyId: Number(values.installmentPolicyId),
                selectedExtraServiceIds: null,
              },
              {
                onSuccess: () => {
                  setCreateContractOpen(false);
                  // ✅ بعد إنشاء العقد: تحديث الحساب وجلب الأقساط
                  void accountQuery.refetch();
                  // ✅ ننتظر قليلاً حتى ينتهي الـ refetch ثم نجلب الأقساط
                  setTimeout(() => {
                    void refetchInstallments();
                  }, 500);
                },
              },
            );
          }}
        />
      ) : null}

      {account && !isDraft ? (
        <UpdateContractDialog
          open={updateContractOpen}
          onOpenChange={setUpdateContractOpen}
          account={account}
          feePlans={feePlans}
          installmentPolicies={installmentPolicies}
          isLoading={updateContract.isPending}
          onSubmit={(
            accountId,
            updateStudentId,
            values,
          ) => {
            updateContract.mutate(
              {
                accountId,
                studentId: updateStudentId,
                payload: values,
              },
              {
                onSuccess: () => {
                  setUpdateContractOpen(false);
                  // ✅ بعد تحديث العقد: تحديث الحساب وجلب الأقساط الجديدة
                  void accountQuery.refetch();
                  setTimeout(() => {
                    void refetchInstallments();
                  }, 500);
                },
              },
            );
          }}
        />
      ) : null}
    </div>
  );
}