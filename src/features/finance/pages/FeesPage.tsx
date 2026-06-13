import { useMemo, useState } from "react";
import { BarChart3, CreditCard, DollarSign, Users } from "lucide-react";

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

export function FeesPage() {
  const { data, isLoading } = useFinance();
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [reminderNotice, setReminderNotice] = useState<string | null>(null);

  if (isLoading || !data) {
    return (
      <div className="rounded-3xl bg-card p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-foreground">Fees</h1>
        <p className="mt-2 text-muted-foreground">Loading financial summary...</p>
      </div>
    );
  }

  const gradeOptions = useMemo(
    () => ["all", ...new Set(data.gradeFees.map((fee) => fee.grade))],
    [data.gradeFees]
  );

  const classOptions = useMemo(
    () => [
      "all",
      ...new Set(
        data.gradeFees
          .filter((fee) => gradeFilter === "all" || fee.grade === gradeFilter)
          .map((fee) => fee.className)
      ),
    ],
    [data.gradeFees, gradeFilter]
  );

  const filteredFees = useMemo(
    () =>
      data.gradeFees.filter((fee) => {
        const matchesGrade = gradeFilter === "all" || fee.grade === gradeFilter;
        const matchesClass = classFilter === "all" || fee.className === classFilter;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          fee.grade.toLowerCase().includes(query) ||
          fee.className.toLowerCase().includes(query) ||
          fee.annualFee.toLowerCase().includes(query) ||
          fee.collected.toLowerCase().includes(query) ||
          fee.outstanding.toLowerCase().includes(query);

        return matchesGrade && matchesClass && matchesSearch;
      }),
    [data.gradeFees, gradeFilter, classFilter, searchQuery]
  );

  const totalCollected = filteredFees.reduce((sum, fee) => {
    return sum + Number(fee.collected.replace(/[^0-9.-]+/g, ""));
  }, 0);

  const totalOutstanding = filteredFees.reduce((sum, fee) => {
    return sum + Number(fee.outstanding.replace(/[^0-9.-]+/g, ""));
  }, 0);

  const filteredCount = filteredFees.length;

  const handleSendReminders = () => {
    setReminderNotice(
      `Reminders queued for ${filteredCount} fee schedules. Outstanding balances are under review.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="soft-card rounded-3xl p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-foreground">Financial Reports</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Monitor tuition fee performance across grade levels and classes with balance and collection insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button className="rounded-2xl" size="lg">
              Export PDF
            </Button>
            <Button variant="outline" className="rounded-2xl" size="lg">
              Export Excel
            </Button>
            <Button variant="secondary" className="rounded-2xl" size="lg" onClick={handleSendReminders}>
              Send reminders
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Search fee schedules</p>
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search grade, class, or amount"
            />
          </div>
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
            <p className="text-sm font-medium text-muted-foreground">Class</p>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue>{classFilter === "all" ? "All classes" : classFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className === "all" ? "All classes" : className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {reminderNotice ? (
          <div className="rounded-3xl border border-border/70 bg-background p-4 text-sm text-foreground">
            {reminderNotice}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total fees collected</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {totalCollected.toLocaleString("en-US")} SAR
              </h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <DollarSign size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Revenue from annual tuition fees across school classes.</p>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Outstanding balance</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {totalOutstanding.toLocaleString("en-US")} SAR
              </h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
              <CreditCard size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Total remaining tuition amount pending collection.</p>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active fee schedules</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {data.gradeFees.length}
              </h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-info/10 text-info">
              <BarChart3 size={22} />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Grade and class fee plans defined for the current academic year.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Fees by grade and class</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Compare annual tuition fees, collected amounts, and outstanding balances per grade/class.
                </p>
              </div>

              <Button variant="outline" className="rounded-2xl" size="lg">
                View all grades
              </Button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[2rem] border border-border/70">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Class</th>
                    <th className="px-6 py-4">Annual Fee</th>
                    <th className="px-6 py-4">Collected</th>
                    <th className="px-6 py-4">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFees.length > 0 ? (
                    filteredFees.map((fee) => (
                      <tr key={`${fee.grade}-${fee.className}`} className="border-t border-border/70 bg-background">
                        <td className="px-6 py-4 font-semibold text-foreground">{fee.grade}</td>
                        <td className="px-6 py-4 text-muted-foreground">{fee.className}</td>
                        <td className="px-6 py-4 text-foreground">{fee.annualFee}</td>
                        <td className="px-6 py-4 text-foreground">{fee.collected}</td>
                        <td className="px-6 py-4 text-destructive">{fee.outstanding}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-border/70 bg-background">
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                        No fee schedules match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <Card className="rounded-[2rem] p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Remaining balances</p>
                <p className="mt-2 text-sm text-muted-foreground">Top student balances and next due dates.</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-info/10 text-info">
                <Users size={22} />
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {data.remainingBalances.map((balance) => (
                <div key={balance.student} className="rounded-3xl bg-background p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{balance.student}</p>
                      <p className="text-sm text-muted-foreground">{balance.grade} • Class {balance.className}</p>
                    </div>
                    <p className="text-sm font-semibold text-destructive">{balance.balance}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Next due: {balance.nextDue}</p>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
