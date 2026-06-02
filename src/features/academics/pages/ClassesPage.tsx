import {
  BookOpen,
  Copy,
  Edit3,
  Filter,
  GraduationCap,
  Grid2X2,
  Import,
  List,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import {
  academicClassStats,
  classesMock,
} from "@/features/academics/mocks/classes.mock";

const toneClasses: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

const gradeClasses: Record<string, string> = {
  Seventh: "bg-primary/10 text-primary",
  Eighth: "bg-warning/10 text-warning",
  Ninth: "bg-info/10 text-info",
};

export function ClassesPage() {
  return (
    <div className="space-y-4">
      <section className="soft-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen size={26} strokeWidth={1.9} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                Classes
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create, update and manage school classes
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex h-12 items-center gap-2 rounded-2xl border border-border/70 bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-muted">
              <Import size={17} />
              Import
            </button>

            <button className="flex h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90">
              <Plus size={18} />
              Add New Class
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {academicClassStats.map((item) => (
          <article key={item.id} className="soft-card rounded-3xl p-5">
            <div className="flex items-center justify-between gap-4">
              <div
                className={[
                  "flex h-14 w-14 items-center justify-center rounded-2xl",
                  toneClasses[item.tone],
                ].join(" ")}
              >
                {item.id === "total" ? (
                  <GraduationCap size={26} />
                ) : (
                  <Users size={25} />
                )}
              </div>

              <div className="h-10 w-16 rounded-xl bg-primary/5" />
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
              <h3 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-foreground">
                {item.value}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="soft-card overflow-hidden rounded-3xl">
          <div className="flex flex-col gap-4 border-b border-border/70 p-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">
              All Classes
            </h2>

            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  placeholder="Search classes..."
                  className="h-11 w-full rounded-2xl border border-border/70 bg-background pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <button className="flex h-11 items-center gap-2 rounded-2xl border border-border/70 bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted">
                <Filter size={16} />
                All Grades
              </button>

              <div className="flex gap-2">
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background text-muted-foreground hover:bg-muted">
                  <List size={17} />
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-primary/10 text-primary">
                  <Grid2X2 size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse">
              <thead>
                <tr className="border-b border-border/70 bg-muted/25 text-left">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Class Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Grade
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Sections
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Students
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Class Supervisor
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Room
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {classesMock.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/60 transition hover:bg-muted/20 last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Users size={19} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                          gradeClasses[item.grade],
                        ].join(" ")}
                      >
                        {item.grade}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {item.sections}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {item.students}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.supervisorAvatar}
                          alt={item.supervisor}
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {item.supervisor}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.room}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Active
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition hover:bg-primary/15">
                          <Edit3 size={15} />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-info/10 text-info transition hover:bg-info/15">
                          <Copy size={15} />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition hover:bg-destructive/15">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border/70 px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 to 5 of 12 classes
            </p>

            <div className="flex gap-2">
              <button className="h-9 w-9 rounded-xl border border-border bg-card text-muted-foreground">
                ‹
              </button>
              <button className="h-9 w-9 rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                1
              </button>
              <button className="h-9 w-9 rounded-xl border border-border bg-card text-sm">
                2
              </button>
              <button className="h-9 w-9 rounded-xl border border-border bg-card text-sm">
                3
              </button>
              <button className="h-9 w-9 rounded-xl border border-border bg-card text-muted-foreground">
                ›
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="soft-card rounded-3xl p-5">
            <h3 className="text-base font-bold text-foreground">
              Class Distribution
            </h3>

            <div className="mt-6 flex h-40 items-center justify-center rounded-full bg-primary/10 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Classes</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {["Seventh Grade", "Eighth Grade", "Ninth Grade"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item}</span>
                  <span className="font-semibold text-foreground">
                    4 (33.3%)
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="soft-card rounded-3xl p-5">
            <h3 className="text-base font-bold text-foreground">
              Quick Actions
            </h3>

            <div className="mt-4 space-y-2">
              {[
                "Add New Class",
                "Manage Sections",
                "View Classrooms",
                "Import Classes",
              ].map((item) => (
                <button
                  key={item}
                  className="flex h-11 w-full items-center justify-between rounded-2xl border border-border/70 bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  {item}
                  <span className="text-muted-foreground">›</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}