import { useEffect, useMemo, useState } from "react";
import { CreditCard, FileText, Wallet } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useFinance } from "../hooks/useFinance";
import type { PaymentRecord } from "../types/finance.types";

export function PaymentsPage() {
  const { data, isLoading } = useFinance();
  const [paymentRows, setPaymentRows] = useState<PaymentRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (data) {
      setPaymentRows(data.payments);
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="rounded-3xl bg-card p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="mt-2 text-muted-foreground">Loading payment history...</p>
      </div>
    );
  }

  const completedCount = paymentRows.filter((payment) => payment.status === "Completed").length;
  const overdueCount = paymentRows.filter((payment) => payment.status === "Overdue").length;

  const filteredPayments = useMemo(
    () =>
      paymentRows.filter((payment) => {
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          payment.student.toLowerCase().includes(query) ||
          payment.id.toLowerCase().includes(query) ||
          payment.amount.toLowerCase().includes(query);

        return matchesStatus && matchesMethod && matchesSearch;
      }),
    [paymentRows, statusFilter, methodFilter, searchQuery]
  );

  const handleMarkCompleted = (paymentId: string) => {
    setPaymentRows((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? { ...payment, status: "Completed", overdue: false }
          : payment
      )
    );
    setActionMessage(`Payment ${paymentId} marked as completed.`);
  };

  return (
    <div className="space-y-6">
      <div className="soft-card rounded-3xl p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-foreground">Payment History</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Track tuition payments, overdue balances, and reconcile transaction history for students.
            </p>
          </div>
          <Button variant="outline" className="rounded-2xl" size="lg">
            Export History
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Search payments</p>
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by student, ID or amount"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue>{statusFilter === "all" ? "All statuses" : statusFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "all", label: "All statuses" },
                  { value: "Completed", label: "Completed" },
                  { value: "Pending", label: "Pending" },
                  { value: "Overdue", label: "Overdue" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Method</p>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue>{methodFilter === "all" ? "All methods" : methodFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "all", label: "All methods" },
                  { value: "Bank Transfer", label: "Bank Transfer" },
                  { value: "Cash", label: "Cash" },
                  { value: "Credit Card", label: "Credit Card" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {actionMessage ? (
        <div className="rounded-3xl border border-border/70 bg-background p-4 text-sm text-foreground">
          {actionMessage}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment records</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{paymentRows.length}</h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Wallet size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Records for students, parents, and tuition receipts.</p>
        </Card>
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed payments</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{completedCount}</h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-success/10 text-success">
              <FileText size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Payments fully processed and reconciled.</p>
        </Card>
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue payments</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{overdueCount}</h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
              <CreditCard size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Invoices past due date and needing follow-up.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Payment history</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Review individual tuition payments and overdue amounts by student.
              </p>
            </div>
            <Button variant="outline" className="rounded-2xl" size="lg">
              View overdue list
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-border/70">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Payment ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-t border-border/70 bg-background">
                      <td className="px-6 py-4 font-semibold text-foreground">{payment.id}</td>
                      <td className="px-6 py-4 text-foreground">{payment.student}</td>
                      <td className="px-6 py-4 text-foreground">{payment.amount}</td>
                      <td className="px-6 py-4 text-muted-foreground">{payment.method}</td>
                      <td className={`px-6 py-4 font-semibold ${payment.status === "Overdue" ? "text-destructive" : "text-foreground"}`}>
                        {payment.status}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{payment.date}</td>
                      <td className="px-6 py-4">
                        {payment.status !== "Completed" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkCompleted(payment.id)}
                          >
                            Mark completed
                          </Button>
                        ) : (
                          <span className="text-sm text-success">Reconciled</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-border/70 bg-background">
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No payments match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-6">
          <Card className="rounded-[2rem] p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Overdue summary</p>
                <p className="mt-2 text-sm text-muted-foreground">Current overdue balance and account statistics.</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
                <CreditCard size={22} />
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-background p-4">
                <p className="text-sm text-muted-foreground">Total overdue</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{data.overdueSummary.totalOverdue}</p>
              </div>
              <div className="rounded-3xl bg-background p-4">
                <p className="text-sm text-muted-foreground">Overdue accounts</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{data.overdueSummary.overdueAccounts}</p>
              </div>
              <div className="rounded-3xl bg-background p-4">
                <p className="text-sm text-muted-foreground">Average delay</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{data.overdueSummary.averageDelay}</p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
