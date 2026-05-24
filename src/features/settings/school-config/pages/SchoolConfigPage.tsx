import { useState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ImagePlus,
  LocateFixed,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { schoolConfigMock } from "../mocks/school-config.mock";
import type {
  GradeStructure,
  SchoolConfig,
} from "../types/school-config.types";
import type { SchoolGrade } from "../types/school.enums";

const gradeLabels: Record<SchoolGrade, string> = {
  seventh: "Seventh Grade",
  eighth: "Eighth Grade",
  ninth: "Ninth Grade",
};

const availableGrades: SchoolGrade[] = ["seventh", "eighth", "ninth"];

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-border/70 bg-card px-4 text-sm text-foreground transition focus:border-primary"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2 md:col-span-2">
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-foreground transition focus:border-primary"
      />
    </label>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-border/60 bg-card/80 p-4 shadow-soft">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={18} />
      </div>

      <p className="text-xs font-semibold text-muted-foreground">{label}</p>

      <p className="mt-1 truncate text-sm font-bold text-foreground">
        {value || "Not set"}
      </p>
    </div>
  );
}

export function SchoolConfigPage() {
  const [config, setConfig] = useState<SchoolConfig>(schoolConfigMock);

  const updateConfig = <K extends keyof SchoolConfig>(
    key: K,
    value: SchoolConfig[K]
  ) => {
    setConfig((current) => ({
      ...current,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateGrade = (
    gradeId: string,
    key: keyof GradeStructure,
    value: string | number | boolean
  ) => {
    setConfig((current) => ({
      ...current,
      grades: current.grades.map((grade) =>
        grade.id === gradeId ? { ...grade, [key]: value } : grade
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addGrade = () => {
    const nextGrade = availableGrades.find(
      (grade) => !config.grades.some((item) => item.grade === grade)
    );

    if (!nextGrade) return;

    setConfig((current) => ({
      ...current,
      grades: [
        ...current.grades,
        {
          id: `grade-${nextGrade}`,
          grade: nextGrade,
          classroomsCount: 1,
          studentsPerClassroom: 25,
          isActive: true,
        },
      ],
    }));
  };

  const deleteGrade = (gradeId: string) => {
    setConfig((current) => ({
      ...current,
      grades: current.grades.filter((grade) => grade.id !== gradeId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      setConfig((current) => ({
        ...current,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        updatedAt: new Date().toISOString(),
      }));
    });
  };

  return (
    <div className="space-y-6">
      <section className="dashboard-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[24px] bg-primary/10 text-primary">
              <Building2 size={24} />
            </div>

            <h1 className="text-2xl font-black tracking-[-0.03em] text-foreground">
              School Configuration
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Configure school profile, contact details, images, location, and
              academic structure.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={Building2} label="School Name" value={config.schoolName} />
        <InfoCard icon={MapPin} label="Address" value={config.address} />
        <InfoCard icon={Phone} label="Phone" value={config.phoneNumber} />
        <InfoCard icon={CalendarDays} label="Academic Year" value={config.academicYear} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="dashboard-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black text-foreground">
              School Profile
            </h2>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Basic Info
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="School Name"
              value={config.schoolName}
              onChange={(value) => updateConfig("schoolName", value)}
            />

            <Field
              label="Academic Year"
              value={config.academicYear}
              onChange={(value) => updateConfig("academicYear", value)}
            />

            <TextareaField
              label="Description"
              value={config.description}
              onChange={(value) => updateConfig("description", value)}
            />

            <Field
              label="Address"
              value={config.address}
              onChange={(value) => updateConfig("address", value)}
            />

            <Field
              label="City"
              value={config.city}
              onChange={(value) => updateConfig("city", value)}
            />

            <Field
              label="Country"
              value={config.country}
              onChange={(value) => updateConfig("country", value)}
            />

            <Field
              label="Phone Number"
              value={config.phoneNumber}
              onChange={(value) => updateConfig("phoneNumber", value)}
            />

            <Field
              label="Emergency Phone"
              value={config.emergencyPhoneNumber}
              onChange={(value) => updateConfig("emergencyPhoneNumber", value)}
            />

            <Field
              label="Email"
              value={config.email}
              onChange={(value) => updateConfig("email", value)}
            />

            <Field
              label="Website"
              value={config.website ?? ""}
              onChange={(value) => updateConfig("website", value)}
            />

            <Field
              label="Opening Time"
              type="time"
              value={config.openingTime}
              onChange={(value) => updateConfig("openingTime", value)}
            />

            <Field
              label="Closing Time"
              type="time"
              value={config.closingTime}
              onChange={(value) => updateConfig("closingTime", value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="dashboard-card p-6">
            <h2 className="mb-5 text-lg font-black text-foreground">
              Geo Location
            </h2>

            <button
              type="button"
              onClick={detectLocation}
              className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              <LocateFixed size={17} />
              Detect Current Location
            </button>

            <div className="space-y-3">
              <div className="rounded-2xl bg-background p-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  Latitude
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {config.location.latitude ?? "Not selected"}
                </p>
              </div>

              <div className="rounded-2xl bg-background p-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  Longitude
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {config.location.longitude ?? "Not selected"}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-card p-6">
            <h2 className="mb-5 text-lg font-black text-foreground">
              Contact Summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-background p-3">
                <Phone size={17} className="text-primary" />
                <span className="text-sm font-semibold">{config.phoneNumber}</span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-background p-3">
                <ShieldAlert size={17} className="text-destructive" />
                <span className="text-sm font-semibold">
                  {config.emergencyPhoneNumber}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-background p-3">
                <Mail size={17} className="text-primary" />
                <span className="truncate text-sm font-semibold">
                  {config.email}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-card p-6">
            <h2 className="mb-5 text-lg font-black text-foreground">
              School Images
            </h2>

            <button
              type="button"
              className="flex h-36 w-full flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-primary/40 bg-primary/5 text-primary transition hover:bg-primary/10"
            >
              <ImagePlus size={24} />
              <span className="text-sm font-bold">Upload School Images</span>
            </button>
          </div>
        </div>
      </section>

      <section className="dashboard-card p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-foreground">
              Academic Structure
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Configure grade levels, number of classrooms, and student capacity.
            </p>
          </div>

          <button
            type="button"
            onClick={addGrade}
            disabled={config.grades.length >= availableGrades.length}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-xs font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
          >
            <Plus size={15} />
            Add Grade
          </button>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-border/70">
          <table>
            <thead className="bg-surface">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Grade
                </th>
                <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Classrooms
                </th>
                <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Students / Classroom
                </th>
                <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Capacity
                </th>
                <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {config.grades.map((grade) => (
                <tr key={grade.id} className="border-t border-border/70">
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-foreground">
                      {gradeLabels[grade.grade]}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <input
                      type="number"
                      min={1}
                      value={grade.classroomsCount}
                      onChange={(event) =>
                        updateGrade(
                          grade.id,
                          "classroomsCount",
                          Number(event.target.value)
                        )
                      }
                      className="mx-auto h-9 w-20 rounded-xl border border-border bg-card text-center text-sm font-bold"
                    />
                  </td>

                  <td className="px-5 py-4 text-center">
                    <input
                      type="number"
                      min={1}
                      value={grade.studentsPerClassroom}
                      onChange={(event) =>
                        updateGrade(
                          grade.id,
                          "studentsPerClassroom",
                          Number(event.target.value)
                        )
                      }
                      className="mx-auto h-9 w-20 rounded-xl border border-border bg-card text-center text-sm font-bold"
                    />
                  </td>

                  <td className="px-5 py-4 text-center text-sm font-bold text-foreground">
                    {grade.classroomsCount * grade.studentsPerClassroom}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        updateGrade(grade.id, "isActive", !grade.isActive)
                      }
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
                        grade.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      <CheckCircle2 size={13} />
                      {grade.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => deleteGrade(grade.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive transition hover:bg-destructive hover:text-white"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}