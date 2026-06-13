import { useMemo, useState } from "react";
import { AlertTriangle, ShieldCheck, Users } from "lucide-react";

import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useComplaints } from "../hooks/useComplaints";
import type { Complaint } from "../types/complaint.types";

const statuses = ["All", "New", "In Review", "Assigned", "Resolved"] as const;
const categories = ["All", "Academic", "Behavior", "Financial", "General"] as const;

export function ComplaintsPage() {
  const { data = [], isLoading, isError } = useComplaints();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [category, setCategory] = useState<string>("All");

  const filteredComplaints = useMemo(() => {
    return data.filter((complaint) => {
      const matchesSearch =
        complaint.subject.toLowerCase().includes(search.toLowerCase()) ||
        complaint.summary.toLowerCase().includes(search.toLowerCase()) ||
        complaint.parentName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || complaint.status === status;
      const matchesCategory = category === "All" || complaint.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [data, search, status, category]);

  const openCount = filteredComplaints.filter((item) => item.status !== "Resolved").length;
  const highPriorityCount = filteredComplaints.filter((item) => item.priority === "High").length;

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-card p-12 text-center">
        <p className="text-muted-foreground">Loading complaints...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-destructive/10 p-12 text-center">
        <p className="text-destructive">There was an issue loading complaints.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Complaints & Escalations</h1>
          <p className="text-muted-foreground">
            Review parent complaints, route issues to supervisors, and track resolution status.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <ShieldCheck size={18} />
          {openCount} unresolved cases
        </div>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-background p-5">
            <p className="text-sm text-muted-foreground">Total complaints</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{filteredComplaints.length}</p>
          </div>
          <div className="rounded-3xl bg-background p-5">
            <p className="text-sm text-muted-foreground">Open reviews</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{openCount}</p>
          </div>
          <div className="rounded-3xl bg-background p-5">
            <p className="text-sm text-muted-foreground">High priority</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{highPriorityCount}</p>
          </div>
          <div className="rounded-3xl bg-background p-5">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{filteredComplaints.filter((item) => item.status === "Resolved").length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search complaints..."
            className="h-11 rounded-2xl"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-11 rounded-2xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 rounded-2xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
        <div className="grid grid-cols-[1.1fr_0.85fr_0.85fr_0.85fr_0.7fr_0.8fr] gap-4 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span>Complaint</span>
          <span>Parent</span>
          <span>Supervisor</span>
          <span>Category</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        <div className="divide-y divide-border/70">
          {filteredComplaints.map((complaint: Complaint) => (
            <div key={complaint.id} className="grid grid-cols-[1.1fr_0.85fr_0.85fr_0.85fr_0.7fr_0.8fr] gap-4 px-6 py-5 items-center">
              <div>
                <p className="text-sm font-semibold text-foreground">{complaint.subject}</p>
                <p className="mt-1 text-sm text-muted-foreground">{complaint.summary}</p>
              </div>
              <p className="text-sm text-foreground">{complaint.parentName}</p>
              <p className="text-sm text-muted-foreground">{complaint.assignedSupervisor}</p>
              <p className="text-sm text-foreground">{complaint.category}</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <AlertTriangle size={14} />
                {complaint.status}
              </div>
              <p className="text-sm text-muted-foreground">{complaint.date}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Users size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Routing rules</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Complaints are routed to supervisors based on category and student grade.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-background p-4">
              <p className="text-sm text-muted-foreground">Behavior issues</p>
              <p className="mt-1 text-lg font-semibold text-foreground">Route to Behavioral Supervisor</p>
            </div>
            <div className="rounded-3xl bg-background p-4">
              <p className="text-sm text-muted-foreground">Academic support</p>
              <p className="mt-1 text-lg font-semibold text-foreground">Route to Academic Supervisor</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Escalation policy</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Automatic escalation when a complaint is unresolved for more than 3 days.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-background p-4">
            <p className="text-sm text-muted-foreground">Last escalated</p>
            <p className="mt-1 text-lg font-semibold text-foreground">May 16, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
