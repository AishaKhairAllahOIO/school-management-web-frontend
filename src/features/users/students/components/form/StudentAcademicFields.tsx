import {
  BookOpen,
  Building2,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";


import { useClassrooms } from "@/features/academics/classrooms/hooks/useClassrooms";
import { useGrades } from "@/features/academics/grades/hooks/useGrades";
import { useAcademicYears } from "@/features/settings/academic/hooks/useAcademicSettings";

import { FormField } from "./StudentFormPrimitives";

type StudentAcademicFieldsProps = {
  academicYearId: string;
  gradeId: string;
  classroomId: string;

  onAcademicYearChange: (
    value: string,
  ) => void;

  onGradeChange: (
    value: string,
  ) => void;

  onClassroomChange: (
    value: string,
  ) => void;

  disabled?: boolean;
  classroomOptional?: boolean;
};

export function StudentAcademicFields({
  academicYearId,
  gradeId,
  classroomId,
  onAcademicYearChange,
  onGradeChange,
  onClassroomChange,
  disabled = false,
  classroomOptional = true,
}: StudentAcademicFieldsProps) {
  const academicYearsQuery =
    useAcademicYears();

  const gradesQuery = useGrades();
  const classroomsQuery = useClassrooms();

  const academicYears = useMemo(
    () =>
      [...(academicYearsQuery.data ?? [])].sort(
        (first, second) => {
          if (
            first.isCurrent !==
            second.isCurrent
          ) {
            return first.isCurrent ? -1 : 1;
          }

          return second.name.localeCompare(
            first.name,
          );
        },
      ),
    [academicYearsQuery.data],
  );

  const grades = useMemo(
    () =>
      [...(gradesQuery.data ?? [])].sort(
        (first, second) =>
          first.level - second.level ||
          first.name.localeCompare(
            second.name,
          ),
      ),
    [gradesQuery.data],
  );

  const classrooms = useMemo(() => {
    if (!academicYearId || !gradeId) {
      return [];
    }

    return (classroomsQuery.data ?? [])
      .filter(
        (classroom) =>
          String(
            classroom.academicYearId,
          ) === academicYearId &&
          String(classroom.gradeId) ===
            gradeId,
      )
      .sort((first, second) =>
        first.name.localeCompare(second.name),
      );
  }, [
    academicYearId,
    gradeId,
    classroomsQuery.data,
  ]);

  const isLoading =
    academicYearsQuery.isLoading ||
    gradesQuery.isLoading ||
    classroomsQuery.isLoading;

  const hasError =
    academicYearsQuery.isError ||
    gradesQuery.isError ||
    classroomsQuery.isError;

  if (isLoading) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-[18px] border border-border/60 bg-muted/[0.15]">
        <div className="flex items-center gap-3 text-sm font-normal text-muted-foreground">
          <Loader2
            size={17}
            className="animate-spin text-primary"
          />

          Loading academic options...
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="rounded-[18px] border border-destructive/15 bg-destructive/[0.035] p-5">
        <p className="text-sm font-medium text-destructive">
          Academic options could not be
          loaded.
        </p>

        <p className="mt-1 text-xs font-normal leading-5 text-muted-foreground">
          Check the server connection before
          saving the student.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <FormField
        label="Academic year"
        required
        hint={
          academicYears.length === 0
            ? "Create an academic year before enrolling students."
            : undefined
        }
      >
        <div className="relative">
          <CalendarDays
            size={16}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Select
            value={academicYearId || "none"}
            disabled={disabled || academicYears.length === 0}
            onValueChange={(value) =>
              onAcademicYearChange(value === "none" ? "" : value)
            }
          >
            <SelectTrigger className="h-12 rounded-[15px] pl-10">
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select academic year</SelectItem>
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={String(year.id)}>
                  {year.name}{year.isCurrent ? " · Current" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormField>

      <FormField
        label="Grade level"
        required
        hint={
          grades.length === 0
            ? "Create grade levels before enrolling students."
            : undefined
        }
      >
        <div className="relative">
          <BookOpen
            size={16}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Select
            value={gradeId || "none"}
            disabled={disabled || grades.length === 0}
            onValueChange={(value) =>
              onGradeChange(value === "none" ? "" : value)
            }
          >
            <SelectTrigger className="h-12 rounded-[15px] pl-10">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select grade</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade.id} value={String(grade.id)}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormField>

      <FormField
        label={
          classroomOptional
            ? "Classroom"
            : "Classroom"
        }
        required={!classroomOptional}
        hint={
          !academicYearId || !gradeId
            ? "Select an academic year and grade first."
            : classrooms.length === 0
              ? "No classroom is available for this year and grade."
              : classroomOptional
                ? "Optional. The student may be assigned later."
                : undefined
        }
      >
        <div className="relative">
          <Building2
            size={16}
            strokeWidth={1.7}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Select
            value={classroomId || "none"}
            disabled={
              disabled ||
              !academicYearId ||
              !gradeId ||
              classrooms.length === 0
            }
            onValueChange={(value) =>
              onClassroomChange(value === "none" ? "" : value)
            }
          >
            <SelectTrigger className="h-12 rounded-[15px] pl-10">
              <SelectValue
                placeholder={classroomOptional ? "No classroom yet" : "Select classroom"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                {classroomOptional ? "No classroom yet" : "Select classroom"}
              </SelectItem>
              {classrooms.map((classroom) => (
                <SelectItem key={classroom.id} value={String(classroom.id)}>
                  {classroom.name} · {classroom.availableSeats} seats available
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormField>
    </div>
  );
}