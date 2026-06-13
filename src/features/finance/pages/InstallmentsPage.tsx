import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, ListChecks } from "lucide-react";

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
import type { InstallmentSchedule } from "../types/finance.types";

export function InstallmentsPage() {
  const { data, isLoading } = useFinance();
  const [installmentRows, setInstallmentRows] = useState<InstallmentSchedule[]>([]);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data) {
      setInstallmentRows(data.installments);
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="rounded-3xl bg-card p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-foreground">Installments</h1>
        <p className="mt-2 text-muted-foreground">Loading installment schedule...</p>
      </div>
    );
  }

  const pendingCount = installmentRows.filter((item) => item.status === "Pending").length;
  const delayedCount = installmentRows.filter((item) => item.status === "Delayed").length;
  const paidCount = installmentRows.filter((item) => item.status === "Paid").length;

  const gradeOptions = useMemo(
    () => ["all", ...new Set(installmentRows.map((item) => item.grade))],
    [installmentRows]
  );

  const filteredInstallments = useMemo(
    () =>
      installmentRows.filter((item) => {
        const matchesGrade = gradeFilter === "all" || item.grade === gradeFilter;
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          item.student.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.amount.toLowerCase().includes(query);

        return matchesGrade && matchesStatus && matchesSearch;
      }),
    [installmentRows, gradeFilter, statusFilter, searchQuery]
  );

  const handleMarkPaid = (installmentId: string) => {
    setInstallmentRows((prev) =>
      prev.map((item) =>
        item.id === installmentId ? { ...item, status: "Paid" } : item
      )
    );
    setMessage(`Installment ${installmentId} marked as paid.`);
  };

  return (
    <div className="space-y-6">
      <div className="soft-card rounded-3xl p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-foreground">Installment Schedules</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Track scheduled tuition installments and monitor upcoming due dates for student accounts.
            </p>
          </div>
          <Button variant="outline" className="rounded-2xl" size="lg">
            Download schedule
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending installments</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{pendingCount}</h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-info/10 text-info">
              <CalendarDays size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Installments that are due but not yet paid.</p>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Delayed installments</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{delayedCount}</h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
              <Clock3 size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Installments missed or delayed beyond the due date.</p>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed installments</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{paidCount}</h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-success/10 text-success">
              <ListChecks size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Installments that have been paid in full.</p>
        </Card>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Upcoming installment schedule</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Review the next payments by student and verify schedule compliance.
            </p>
          </div>
          <Button variant="outline" className="rounded-2xl" size="lg">
            Manage plans
          </Button>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Search installments</p>
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by student, ID or amount"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grade</p>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue>{gradeFilter === "all" ? "All grades" : gradeFilter}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade === "all" ? "All grades" : grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue>{statusFilter === "all" ? "All statuses" : statusFilter}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "all", label: "All statuses" },
                    { value: "Pending", label: "Pending" },
                    { value: "Delayed", label: "Delayed" },
                    { value: "Paid", label: "Paid" },
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

        {message ? (
          <div className="rounded-3xl border border-border/70 bg-background p-4 text-sm text-foreground">
            {message}
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-border/70">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Next Payment</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstallments.length > 0 ? (
                filteredInstallments.map((installment) => (
                  <tr key={installment.id} className="border-t border-border/70 bg-background">
                    <td className="px-6 py-4 font-semibold text-foreground">{installment.student}</td>
                    <td className="px-6 py-4 text-muted-foreground">{installment.grade}</td>
                    <td className="px-6 py-4 text-foreground">{installment.nextPaymentDate}</td>
                    <td className="px-6 py-4 text-foreground">{installment.amount}</td>
                    <td className={`px-6 py-4 font-semibold ${installment.status === "Delayed" ? "text-destructive" : installment.status === "Paid" ? "text-success" : "text-foreground"}`}>
                      {installment.status}
                    </td>
                    <td className="px-6 py-4">
                      {installment.status !== "Paid" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkPaid(installment.id)}
                        >
                          Mark paid
                        </Button>
                      ) : (
                        <span className="text-sm text-success">Paid</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-border/70 bg-background">
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No installments match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
