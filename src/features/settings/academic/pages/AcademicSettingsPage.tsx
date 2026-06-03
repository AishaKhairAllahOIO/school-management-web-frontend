import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Edit3,
  GraduationCap,
  Percent,
  Plus,
  Save,
  Settings2,
  Trash2,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  useAcademicSettings,
  useUpdateAcademicSettings,
} from "@/features/settings/academic/hooks/useAcademicSettings";
import {
  academicSettingsSchema,
  type AcademicSettingsFormValues,
} from "@/features/settings/academic/schemas/academic-settings.schema";

function SelectField({
  label,
  options,
  error,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold text-muted-foreground">
        {label}
      </span>

      <select
        {...props}
        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-xs font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-1 text-[10px] font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function TextField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold text-muted-foreground">
        {label}
      </span>

      <input
        {...props}
        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-xs font-semibold text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      />

      {error ? (
        <p className="mt-1 text-[10px] font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function Toggle({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={18} />
      </span>

      <div>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={19} />
        </span>

        <div>
          <p className="text-[11px] font-semibold text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function getGradeClass(index: number) {
  const classes = [
    "bg-success/10 text-success",
    "bg-info/10 text-info",
    "bg-warning/10 text-warning",
    "bg-primary/10 text-primary",
    "bg-destructive/10 text-destructive",
  ];

  return classes[index % classes.length];
}

export function AcademicSettingsPage() {
  const { data, isLoading, isError } = useAcademicSettings();
  const updateMutation = useUpdateAcademicSettings();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<AcademicSettingsFormValues>({
    resolver: zodResolver(academicSettingsSchema),
  });

  const termsArray = useFieldArray({
    control,
    name: "terms",
  });

  const gradeScaleArray = useFieldArray({
    control,
    name: "gradeScale",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      currentAcademicYearId: data.currentAcademicYearId,
      academicYears: data.academicYears,
      terms: data.terms,
      gradeScale: data.gradeScale.map((item) => ({
        ...item,
        minimumScore: String(item.minimumScore),
        maximumScore: String(item.maximumScore),
      })),
      preferences: data.preferences,
      passingGrade: data.passingGrade,
      maximumGrade: String(data.maximumGrade),
      gpaScale: data.gpaScale,
      minimumAttendancePercentage: String(data.minimumAttendancePercentage),
      promotionThreshold: String(data.promotionThreshold),
    });
  }, [data, reset]);

  if (isLoading) {
    return (
      <div className="soft-card rounded-3xl p-5 text-sm font-semibold text-muted-foreground">
        Loading academic settings...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="soft-card rounded-3xl p-5">
        <h2 className="text-base font-bold text-foreground">
          Failed to load academic settings
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  const academicYears = watch("academicYears") ?? [];
  const terms = watch("terms") ?? [];
  const gradeScale = watch("gradeScale") ?? [];
  const currentAcademicYearId = watch("currentAcademicYearId");
  const currentYear = academicYears.find(
    (year) => year.id === currentAcademicYearId
  );
  const preferences = watch("preferences");

  function onSubmit(values: AcademicSettingsFormValues) {
    updateMutation.mutate({
      ...values,
      gradeScale: values.gradeScale.map((item) => ({
        ...item,
        minimumScore: Number(item.minimumScore),
        maximumScore: Number(item.maximumScore),
      })),
      maximumGrade: Number(values.maximumGrade),
      minimumAttendancePercentage: Number(values.minimumAttendancePercentage),
      promotionThreshold: Number(values.promotionThreshold),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="soft-card rounded-3xl p-5"
    >
      <div className="mb-5">
        <h1 className="text-[24px] font-bold tracking-[-0.04em] text-foreground">
          Academic Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage academic years, terms, grading, promotion rules, and academic
          preferences.
        </p>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Year"
          value={currentYear?.name ?? "—"}
          icon={CalendarDays}
        />

        <StatCard
          label="Terms"
          value={String(terms.length)}
          icon={GraduationCap}
        />

        <StatCard
          label="GPA Scale"
          value={watch("gpaScale") ?? "—"}
          icon={Award}
        />

        <StatCard
          label="Promotion"
          value={`${watch("promotionThreshold") ?? "—"}%`}
          icon={Percent}
        />
      </div>

      <div className="grid gap-4 min-[1024px]:grid-cols-2">
        <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-4">
          <SectionTitle
            title="Academic Year"
            description="Configure the current academic year"
            icon={CalendarDays}
          />

          <div className="mt-5 grid gap-4 min-[760px]:grid-cols-[1fr_116px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Current Academic Year"
                options={academicYears.map((year) => ({
                  label: year.name,
                  value: year.id,
                }))}
                error={errors.currentAcademicYearId?.message}
                {...register("currentAcademicYearId")}
              />

              <TextField
                label="Year Name"
                value={currentYear?.name ?? ""}
                readOnly
              />

              <TextField
                label="Start Date"
                value={currentYear?.startDate ?? ""}
                readOnly
              />

              <TextField
                label="End Date"
                value={currentYear?.endDate ?? ""}
                readOnly
              />
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
              icon={GraduationCap}
            />

            <button
              type="button"
              onClick={() =>
                termsArray.append({
                  id: crypto.randomUUID(),
                  name: "New Term",
                  startDate: "",
                  endDate: "",
                  status: "upcoming",
                })
              }
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
                  <th className="w-[25%] px-3 py-2.5">Term Name</th>
                  <th className="w-[20%] px-3 py-2.5">Start Date</th>
                  <th className="w-[20%] px-3 py-2.5">End Date</th>
                  <th className="w-[18%] px-3 py-2.5">Status</th>
                  <th className="w-[17%] px-3 py-2.5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {termsArray.fields.map((term, index) => (
                  <tr
                    key={term.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-3 py-2.5">
                      <input
                        {...register(`terms.${index}.name`)}
                        className="h-8 w-full rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <input
                        type="date"
                        {...register(`terms.${index}.startDate`)}
                        className="h-8 w-full rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <input
                        type="date"
                        {...register(`terms.${index}.endDate`)}
                        className="h-8 w-full rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <select
                        {...register(`terms.${index}.status`)}
                        className="h-8 w-full rounded-lg border border-border/70 bg-card px-2 text-[10px] font-bold text-foreground outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <Edit3 size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => termsArray.remove(index)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
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
            icon={Award}
          />

          <div className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <SelectField
                label="GPA Scale"
                options={[
                  { label: "4.0", value: "4.0" },
                  { label: "5.0", value: "5.0" },
                  { label: "100", value: "100" },
                ]}
                error={errors.gpaScale?.message}
                {...register("gpaScale")}
              />

              <SelectField
                label="Passing Grade"
                options={[
                  { label: "A", value: "A" },
                  { label: "B", value: "B" },
                  { label: "C", value: "C" },
                  { label: "D", value: "D" },
                  { label: "F", value: "F" },
                ]}
                error={errors.passingGrade?.message}
                {...register("passingGrade")}
              />

              <TextField
                label="Total Grade"
                type="number"
                error={errors.maximumGrade?.message}
                {...register("maximumGrade")}
              />
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold text-muted-foreground">
                Grade Scale
              </p>

              <div className="space-y-1.5">
                {gradeScaleArray.fields.map((grade, index) => (
                  <div
                    key={grade.id}
                    className="grid grid-cols-[0.7fr_1fr_1fr_1.2fr_32px] gap-2"
                  >
                    <input
                      {...register(`gradeScale.${index}.grade`)}
                      className="h-8 min-w-0 rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                    />

                    <input
                      type="number"
                      {...register(`gradeScale.${index}.minimumScore`)}
                      className="h-8 min-w-0 rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                    />

                    <input
                      type="number"
                      {...register(`gradeScale.${index}.maximumScore`)}
                      className="h-8 min-w-0 rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                    />

                    <input
                      {...register(`gradeScale.${index}.description`)}
                      className="h-8 min-w-0 rounded-lg border border-border/70 bg-card px-2 text-[11px] font-semibold text-foreground outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => gradeScaleArray.remove(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-primary/5 p-3">
              <h3 className="mb-3 text-[11px] font-bold text-primary">
                Grade Scale Preview
              </h3>

              <div className="grid gap-2 sm:grid-cols-2">
                {gradeScale.map((grade, index) => (
                  <div
                    key={grade.id}
                    className={[
                      "grid grid-cols-[24px_1fr_auto] items-center gap-2 rounded-xl px-2.5 py-2 text-[10px] font-bold",
                      getGradeClass(index),
                    ].join(" ")}
                  >
                    <span>{grade.grade || "—"}</span>
                    <span>
                      {grade.minimumScore || "—"} - {grade.maximumScore || "—"}
                    </span>
                    <span>{grade.description || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                gradeScaleArray.append({
                  id: crypto.randomUUID(),
                  grade: "",
                  minimumScore: "",
                  maximumScore: "",
                  description: "",
                })
              }
              className="flex h-9 items-center gap-2 rounded-xl border border-border/70 px-3 text-[11px] font-bold text-foreground transition hover:bg-muted"
            >
              <Plus size={13} />
              Add Grade
            </button>
          </div>
        </section>

        <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-4">
          <SectionTitle
            title="Academic Rules"
            description="Configure promotion, attendance, and ranking rules"
            icon={Settings2}
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextField
              label="Minimum Attendance %"
              type="number"
              error={errors.minimumAttendancePercentage?.message}
              {...register("minimumAttendancePercentage")}
            />

            <TextField
              label="Promotion Threshold %"
              type="number"
              error={errors.promotionThreshold?.message}
              {...register("promotionThreshold")}
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border/70">
            {[
              [
                "autoPromoteStudents",
                "Auto Promote Students",
                "Automatically promote students to next class",
              ],
              [
                "allowStudentRepeating",
                "Allow Student Repeating",
                "Allow students to repeat classes",
              ],
              [
                "calculateGpa",
                "Calculate GPA",
                "Enable GPA calculation for students",
              ],
              [
                "rankStudents",
                "Rank Students",
                "Enable ranking of students in classes",
              ],
              [
                "useAttendanceInPromotion",
                "Use Attendance in Promotion",
                "Consider attendance in promotion decision",
              ],
            ].map(([key, title, description], index) => {
              const fieldKey =
                key as keyof AcademicSettingsFormValues["preferences"];

              return (
                <div
                  key={key}
                  className={[
                    "flex items-center justify-between gap-4 px-4 py-3.5",
                    index !== 4 ? "border-b border-border/70" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CheckCircle2 size={15} />
                    </span>

                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {title}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={Boolean(preferences?.[fieldKey])}
                    onClick={() =>
                      setValue(
                        `preferences.${fieldKey}`,
                        !preferences?.[fieldKey],
                        { shouldDirty: true, shouldValidate: true }
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-5 flex justify-end gap-3 border-t border-border/70 pt-5">
        <button
          type="button"
          onClick={() => reset()}
          disabled={!isDirty || updateMutation.isPending}
          className="h-10 rounded-xl border border-border/70 bg-card px-8 text-xs font-bold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-8 text-xs font-bold text-primary-foreground shadow-soft transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save size={15} />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}