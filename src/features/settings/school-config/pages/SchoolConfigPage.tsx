import { useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe,
  LocateFixed,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { schoolConfigMock } from "../mocks/school-config.mock";
import type {
  GradeStructure,
  SchoolConfig,
} from "../types/school-config.types";
import type { SchoolGrade } from "../types/school.enums";

const fallbackImages = [
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
];

const gradeLabels: Record<SchoolGrade, string> = {
  seventh: "Seventh Grade",
  eighth: "Eighth Grade",
  ninth: "Ninth Grade",
};

const gradeNumbers: Record<SchoolGrade, string> = {
  seventh: "7",
  eighth: "8",
  ninth: "9",
};

const availableGrades: SchoolGrade[] = ["seventh", "eighth", "ninth"];

const gradeColors: Record<SchoolGrade, { color: string; soft: string }> = {
  seventh: {
    color: "var(--primary)",
    soft: "color-mix(in srgb, var(--primary) 12%, transparent)",
  },
  eighth: {
    color: "var(--maths)",
    soft: "color-mix(in srgb, var(--maths) 14%, transparent)",
  },
  ninth: {
    color: "var(--english)",
    soft: "color-mix(in srgb, var(--english) 14%, transparent)",
  },
};

function getAvailableGrades(grades: GradeStructure[]) {
  return availableGrades.filter(
    (grade) => !grades.some((item) => item.grade === grade)
  );
}

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
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-2xl border border-border/70 bg-card px-3 text-sm text-foreground transition focus:border-primary"
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
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none rounded-2xl border border-border/70 bg-card px-3 py-3 text-sm text-foreground transition focus:border-primary"
      />
    </label>
  );
}

export function SchoolConfigPage() {
  const [config, setConfig] = useState<SchoolConfig>(schoolConfigMock);
  const [currentImage, setCurrentImage] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<SchoolGrade[]>([]);
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);

  const images =
    config.images.length > 0
      ? config.images.map((image) => image.url)
      : fallbackImages;

  const totalClassrooms = useMemo(
    () => config.grades.reduce((total, grade) => total + grade.classroomsCount, 0),
    [config.grades]
  );

  const totalCapacity = useMemo(
    () =>
      config.grades.reduce(
        (total, grade) =>
          total + grade.classroomsCount * grade.studentsPerClassroom,
        0
      ),
    [config.grades]
  );

  const nextImage = () => {
    setCurrentImage((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  const previousImage = () => {
    setCurrentImage((current) => (current === 0 ? images.length - 1 : current - 1));
  };

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

  const addSelectedGrades = () => {
    const uniqueGrades = selectedGrades.filter(
      (grade) => !config.grades.some((item) => item.grade === grade)
    );

    if (uniqueGrades.length === 0) return;

    setConfig((current) => ({
      ...current,
      grades: [
        ...current.grades,
        ...uniqueGrades.map((grade) => ({
          id: `grade-${grade}-${Date.now()}`,
          grade,
          classroomsCount: 1,
          studentsPerClassroom: 25,
          isActive: true,
        })),
      ],
      updatedAt: new Date().toISOString(),
    }));

    setSelectedGrades([]);
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
    <div className="school-config-page space-y-5">
      <section className="hero-school-card">
        <div className="relative h-[340px] overflow-hidden">
          <img
            src={images[currentImage]}
            alt={config.schoolName}
            className="hero-school-image"
          />

          <div className="hero-school-overlay" />
          <div className="hero-floating-blur left" />
          <div className="hero-floating-blur right" />

          <div className="absolute inset-0 flex flex-col justify-between p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="glass-chip text-xs font-bold text-white">
                Academic Year {config.academicYear}
              </span>

              <div className="flex items-center gap-3">
                <span className="glass-chip text-xs font-bold text-white">
                  {currentImage + 1} / {images.length}
                </span>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-primary shadow-soft transition hover:scale-[1.02]"
                >
                  <Pencil size={16} />
                  Edit School
                </button>
              </div>
            </div>

            <div className="max-w-[570px]">
              <h1 className="text-[42px] font-black leading-[1.05] tracking-[-0.04em] text-white">
                {config.schoolName}
              </h1>

              <p className="mt-4 max-w-[480px] text-[14px] leading-7 text-white/80">
                {config.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin size={15} />
                  <span className="text-sm font-medium">
                    {config.city}, {config.country}
                  </span>
                </div>

                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-success" />
                  <span className="text-sm font-bold text-white">Open Now</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={previousImage}
                className="hero-nav-button flex items-center justify-center"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImage(index)}
                    className={[
                      "hero-indicator",
                      index === currentImage ? "active" : "inactive",
                    ].join(" ")}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextImage}
                className="hero-nav-button flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<Clock3 size={20} />}
          title="Opening Time"
          value={config.openingTime}
          subtitle="School opens"
          tone="success"
        />

        <InfoCard
          icon={<CalendarDays size={20} />}
          title="Closing Time"
          value={config.closingTime}
          subtitle="School closes"
          tone="warning"
        />

        <InfoCard
          icon={<ShieldAlert size={20} />}
          title="Emergency Contact"
          value={config.emergencyPhoneNumber}
          subtitle="Available 24/7"
          tone="destructive"
        />

        <InfoCard
          icon={<Mail size={20} />}
          title="Email Address"
          value={config.email}
          subtitle="We reply within 24h"
          tone="primary"
        />
      </section>

      <section className="glass-card-premium p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ContactItem icon={<Phone size={18} />} title="Phone Number" value={config.phoneNumber} />
          <ContactItem icon={<Globe size={18} />} title="Website" value={config.website ?? "Not set"} />
          <ContactItem icon={<MapPin size={18} />} title="Address" value={`${config.address}, ${config.city}`} />
          <ContactItem
            icon={<LocateFixed size={18} />}
            title="Coordinates"
            value={
              config.location.latitude && config.location.longitude
                ? `${config.location.latitude.toFixed(4)}, ${config.location.longitude.toFixed(4)}`
                : "Not selected"
            }
          />
        </div>
      </section>

      <section className="school-numbers-strip">
        <StatCard icon={<Users size={20} />} value={String(totalCapacity)} label="Total Capacity" />
        <StatCard icon={<Building2 size={20} />} value={String(totalClassrooms)} label="Classrooms" />
        <StatCard icon={<CalendarDays size={20} />} value={String(config.grades.length)} label="Grade Levels" />
        <StatCard icon={<CheckCircle2 size={20} />} value="98%" label="Ready Setup" />
      </section>

      <section className="dashboard-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/55 px-6 py-5">
          <div>
            <h2 className="text-[18px] font-black tracking-[-0.02em] text-foreground">
              Academic Structure
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {getAvailableGrades(config.grades).map((grade) => {
              const isSelected = selectedGrades.includes(grade);
              const color = gradeColors[grade].color;

              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() =>
                    setSelectedGrades((current) =>
                      current.includes(grade)
                        ? current.filter((item) => item !== grade)
                        : [...current, grade]
                    )
                  }
                  className={[
                    "inline-flex h-9 items-center gap-2 rounded-2xl px-3 text-xs font-black transition",
                    isSelected
                      ? "text-white"
                      : "bg-surface text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                  style={isSelected ? { backgroundColor: color } : undefined}
                >
                  {isSelected ? <Check size={13} /> : <Plus size={13} />}
                  Grade {gradeNumbers[grade]}
                </button>
              );
            })}

            <button
              type="button"
              onClick={addSelectedGrades}
              disabled={selectedGrades.length === 0}
              className="inline-flex h-9 items-center gap-2 rounded-2xl bg-primary px-4 text-xs font-black text-white transition hover:bg-primary-dark disabled:opacity-40"
            >
              <Plus size={13} />
              Add
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr className="border-b border-border/50 bg-surface/60">
                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Grade Level
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Classrooms
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Students / Class
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Capacity
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {config.grades.map((grade) => {
                const isEditing = editingGradeId === grade.id;
                const color = gradeColors[grade.grade].color;
                const capacity =
                  grade.classroomsCount * grade.studentsPerClassroom;

                return (
                  <tr
                    key={grade.id}
                    className="border-b border-border/45 transition hover:bg-surface/45"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-black text-white"
                          style={{ backgroundColor: color }}
                        >
                          {gradeNumbers[grade.grade]}
                        </span>

                        <div>
                          <p className="text-sm font-black text-foreground">
                            {gradeLabels[grade.grade]}
                          </p>
                          <p className="text-xs font-semibold text-muted-foreground">
                            Middle school level
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
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
                          className="mx-auto h-9 w-20 rounded-xl border border-border bg-card text-center text-sm font-black"
                        />
                      ) : (
                        <span className="text-sm font-black text-foreground">
                          {grade.classroomsCount}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
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
                          className="mx-auto h-9 w-20 rounded-xl border border-border bg-card text-center text-sm font-black"
                        />
                      ) : (
                        <span className="text-sm font-black text-foreground">
                          {grade.studentsPerClassroom}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-black text-white"
                        style={{ backgroundColor: color }}
                      >
                        {capacity}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          updateGrade(grade.id, "isActive", !grade.isActive)
                        }
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black",
                          grade.isActive
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground",
                        ].join(" ")}
                      >
                        <CheckCircle2 size={13} />
                        {grade.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingGradeId(isEditing ? null : grade.id)
                          }
                          className={[
                            "flex h-9 w-9 items-center justify-center rounded-xl transition",
                            isEditing
                              ? "bg-success text-white"
                              : "bg-primary/10 text-primary hover:bg-primary hover:text-white",
                          ].join(" ")}
                        >
                          {isEditing ? <Check size={15} /> : <Pencil size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteGrade(grade.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition hover:bg-destructive hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {isEditOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end bg-foreground/20 p-4 backdrop-blur-sm">
          <div className="h-full w-full max-w-[440px] overflow-y-auto rounded-[32px] border border-border/70 bg-card p-5 shadow-premium">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground">
                Edit School Configuration
              </h2>

              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X size={17} />
              </button>
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
                label="Phone"
                value={config.phoneNumber}
                onChange={(value) => updateConfig("phoneNumber", value)}
              />

              <Field
                label="Emergency"
                value={config.emergencyPhoneNumber}
                onChange={(value) =>
                  updateConfig("emergencyPhoneNumber", value)
                }
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

            <button
              type="button"
              onClick={detectLocation}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              <LocateFixed size={16} />
              Detect Geo Location
            </button>

            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  subtitle,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  tone: "primary" | "success" | "warning" | "destructive";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="school-stat-card p-5">
      <div className="flex items-center gap-4">
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            toneMap[tone],
          ].join(" ")}
        >
          {icon}
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <h3 className="mt-1 text-[19px] font-black text-foreground">
            {value}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface/60 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 truncate text-sm font-bold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
        {icon}
      </div>

      <div>
        <p className="text-[24px] font-black leading-none text-white">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium text-white/70">{label}</p>
      </div>
    </div>
  );
}