import { CalendarDays, Edit3, Plus, Save, Trash2 } from "lucide-react";

const terms = [
  { name: "First Term", type: "Term", startDate: "Aug 01, 2024", endDate: "Oct 31, 2024", status: "Active" },
  { name: "Second Term", type: "Term", startDate: "Nov 01, 2024", endDate: "Jan 31, 2025", status: "Active" },
  { name: "Third Term", type: "Term", startDate: "Feb 01, 2025", endDate: "Apr 30, 2025", status: "Active" },
  { name: "Summer Term", type: "Term", startDate: "May 01, 2025", endDate: "Jul 31, 2025", status: "Upcoming" },
];

const gradeScale = [
  { grade: "A", min: "90", max: "100", label: "Excellent", className: "bg-success/10 text-success" },
  { grade: "B", min: "80", max: "89", label: "Very Good", className: "bg-info/10 text-info" },
  { grade: "C", min: "70", max: "79", label: "Good", className: "bg-warning/10 text-warning" },
  { grade: "D", min: "60", max: "69", label: "Pass", className: "bg-primary/10 text-primary" },
  { grade: "F", min: "0", max: "59", label: "Fail", className: "bg-destructive/10 text-destructive" },
];

const preferences = [
  { title: "Auto Promote Students", description: "Automatically promote students to next class", enabled: true },
  { title: "Allow Student Repeating", description: "Allow students to repeat classes", enabled: true },
  { title: "Calculate GPA", description: "Enable GPA calculation for students", enabled: true },
  { title: "Rank Students", description: "Enable ranking of students in classes", enabled: true },
  { title: "Use Attendance in Promotion", description: "Consider attendance in promotion decision", enabled: false },
];

function SelectField({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold text-muted-foreground">
        {label}
      </span>

      <select
        defaultValue={value}
        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-xs font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold text-muted-foreground">
        {label}
      </span>

      <input
        defaultValue={value}
        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-xs font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <button
      type="button"
      className={[
        "relative h-6 w-11 shrink-0 rounded-full transition",
        enabled ? "bg-primary" : "bg-muted",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition",
          enabled ? "left-6" : "left-1",
        ].join(" ")}
      />
    </button>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function AcademicSettingsPage() {
  return (
    <div className="soft-card rounded-3xl p-5">
      <div className="mb-5">
        <h1 className="text-[24px] font-bold tracking-[-0.04em] text-foreground">
          Academic Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage all academic related settings and configurations for your school.
        </p>
      </div>

      <div className="grid gap-4 min-[1024px]:grid-cols-2">
        <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-4">
          <SectionTitle
            title="Academic Year"
            description="Configure the current academic year"
          />

          <div className="mt-5 grid gap-4 min-[760px]:grid-cols-[1fr_116px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Current Academic Year"
                value="2024 - 2025"
                options={["2024 - 2025", "2025 - 2026", "2026 - 2027"]}
              />

              <SelectField
                label="Year Format"
                value="2024 - 2025"
                options={["2024 - 2025", "2025 - 2026", "2026 - 2027"]}
              />

              <TextField label="Start Date" value="Aug 01, 2024" />
              <TextField label="End Date" value="Jul 31, 2025" />
            </div>

            <div className="hidden items-center justify-center rounded-3xl bg-primary/10 text-primary min-[760px]:flex">
              <CalendarDays size={52} strokeWidth={1.7} />
            </div>
          </div>
        </section>

        <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <SectionTitle
              title="Terms & Semesters"
              description="Manage terms or semesters for the academic year"
            />

            <button
              type="button"
              className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-primary px-3 text-[11px] font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90"
            >
              <Plus size={14} />
              Add Term
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/70">
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="border-b border-border/70 text-[10px] font-semibold text-muted-foreground">
                  <th className="w-[23%] px-3 py-2.5">Term Name</th>
                  <th className="w-[13%] px-3 py-2.5">Type</th>
                  <th className="w-[20%] px-3 py-2.5">Start Date</th>
                  <th className="w-[20%] px-3 py-2.5">End Date</th>
                  <th className="w-[13%] px-3 py-2.5">Status</th>
                  <th className="w-[11%] px-3 py-2.5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {terms.map((term) => (
                  <tr
                    key={term.name}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="truncate px-3 py-2.5 text-[11px] font-bold text-foreground">
                      {term.name}
                    </td>

                    <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
                      {term.type}
                    </td>

                    <td className="truncate px-3 py-2.5 text-[11px] text-muted-foreground">
                      {term.startDate}
                    </td>

                    <td className="truncate px-3 py-2.5 text-[11px] text-muted-foreground">
                      {term.endDate}
                    </td>

                    <td className="px-3 py-2.5">
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[9px] font-bold",
                          term.status === "Active"
                            ? "bg-success/10 text-success"
                            : "bg-info/10 text-info",
                        ].join(" ")}
                      >
                        {term.status}
                      </span>
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex justify-center gap-1">
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                          <Edit3 size={12} />
                        </button>

                        <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-4">
          <SectionTitle
            title="Grading System"
            description="Configure the grading system for your school"
          />

          <div className="mt-5 grid gap-4 min-[760px]:grid-cols-[1fr_165px]">
            <div className="min-w-0">
              <div className="grid gap-3 sm:grid-cols-3">
                <SelectField
                  label="Grading System"
                  value="Letter Grade"
                  options={["Letter Grade", "Percentage", "Points"]}
                />

                <SelectField
                  label="Passing Grade"
                  value="D"
                  options={["A", "B", "C", "D", "F"]}
                />

                <TextField label="Total Grade (Max)" value="100" />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold text-muted-foreground">
                  Grade Scale
                </p>

                <div className="space-y-1.5">
                  {gradeScale.map((grade) => (
                    <div
                      key={grade.grade}
                      className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2"
                    >
                      <input
                        defaultValue={grade.grade}
                        className="h-8 rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                      />

                      <input
                        defaultValue={grade.min}
                        className="h-8 rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                      />

                      <input
                        defaultValue={grade.max}
                        className="h-8 rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                      />

                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-3 flex h-9 items-center gap-2 rounded-xl border border-border/70 px-3 text-[11px] font-bold text-foreground transition hover:bg-muted">
                <Plus size={13} />
                Add Grade
              </button>
            </div>

            <div className="rounded-3xl bg-primary/5 p-3">
              <h3 className="mb-3 text-[11px] font-bold text-primary">
                Grade Scale Preview
              </h3>

              <div className="space-y-2">
                {gradeScale.map((grade) => (
                  <div
                    key={grade.grade}
                    className={`grid grid-cols-[20px_1fr_auto] items-center gap-2 rounded-xl px-2.5 py-2 text-[10px] font-bold ${grade.className}`}
                  >
                    <span>{grade.grade}</span>
                    <span>
                      {grade.min} - {grade.max}
                    </span>
                    <span>{grade.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-4">
          <SectionTitle
            title="Other Academic Settings"
            description="Configure other academic preferences"
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-border/70">
            {preferences.map((item, index) => (
              <div
                key={item.title}
                className={[
                  "flex items-center justify-between gap-4 px-4 py-3.5",
                  index !== preferences.length - 1
                    ? "border-b border-border/70"
                    : "",
                ].join(" ")}
              >
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <Toggle enabled={item.enabled} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 flex justify-end gap-3 border-t border-border/70 pt-5">
        <button className="h-10 rounded-xl border border-border/70 bg-card px-8 text-xs font-bold text-foreground transition hover:bg-muted">
          Cancel
        </button>

        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-8 text-xs font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
          <Save size={15} />
          Save Changes
        </button>
      </div>
    </div>
  );
}