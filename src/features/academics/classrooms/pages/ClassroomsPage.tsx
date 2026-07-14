import { useMemo } from "react";

import { useAcademicYears } from "@/features/settings/academic/hooks/useAcademicSettings";

import { CrudPage } from "../../shared/components/CrudPage";
import { useGrades } from "../../grades/hooks/useGrades";
import { classroomApi } from "../api/classroom.api";
import {
  useClassrooms,
  useCreateClassroom,
  useDeleteClassroom,
  useUpdateClassroom,
} from "../hooks/useClassrooms";
import type {
  Classroom,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "../types/classroom.types";

export function ClassroomsPage() {
  const classroomsQuery = useClassrooms();
  const yearsQuery = useAcademicYears();
  const gradesQuery = useGrades();

  const yearOptions = useMemo(
    () =>
      (yearsQuery.data ?? []).map((year) => ({
        value: String(year.id),
        label: year.name,
      })),
    [yearsQuery.data],
  );

  const gradeOptions = useMemo(
    () =>
      (gradesQuery.data ?? []).map((grade) => ({
        value: String(grade.id),
        label: grade.name,
      })),
    [gradesQuery.data],
  );

  const yearNameById = useMemo(
    () =>
      new Map(
        yearOptions.map((option) => [
          option.value,
          option.label,
        ]),
      ),
    [yearOptions],
  );

  const gradeNameById = useMemo(
    () =>
      new Map(
        gradeOptions.map((option) => [
          option.value,
          option.label,
        ]),
      ),
    [gradeOptions],
  );

  return (
    <CrudPage<
      Classroom,
      CreateClassroomPayload,
      UpdateClassroomPayload
    >
      title="Classrooms"
      description="Open and manage classrooms for each grade and academic year."
      addLabel="Add Classroom"
      rows={classroomsQuery.data ?? []}
      isLoading={
        classroomsQuery.isLoading ||
        yearsQuery.isLoading ||
        gradesQuery.isLoading
      }
      isError={
        classroomsQuery.isError ||
        yearsQuery.isError ||
        gradesQuery.isError
      }
      onRetry={() => {
        void Promise.all([
          classroomsQuery.refetch(),
          yearsQuery.refetch(),
          gradesQuery.refetch(),
        ]);
      }}
      loadEntity={classroomApi.getById}
      createMutation={useCreateClassroom()}
      updateMutation={useUpdateClassroom()}
      deleteMutation={useDeleteClassroom()}
      fields={[
        {
          name: "academicYearId",
          label: "Academic Year",
          type: "select",
          options: yearOptions,
          defaultValue: yearOptions[0]?.value ?? "",
          required: true,
          disabledOnEdit: true,
          helperText:
            "The academic year is fixed after the classroom is opened.",
        },
        {
          name: "gradeId",
          label: "Grade",
          type: "select",
          options: gradeOptions,
          defaultValue: gradeOptions[0]?.value ?? "",
          required: true,
          disabledOnEdit: true,
          helperText:
            "The backend generates the classroom name automatically.",
        },
        {
          name: "capacity",
          label: "Capacity",
          type: "number",
          defaultValue: 30,
          required: true,
          min: 1,
        },
      ]}
      columns={[
        {
          key: "name",
          header: "Classroom",
          render: (row) => (
            <span className="font-bold">{row.name}</span>
          ),
        },
        {
          key: "year",
          header: "Academic Year",
          render: (row) =>
            yearNameById.get(String(row.academicYearId)) ??
            row.academicYearId,
        },
        {
          key: "grade",
          header: "Grade",
          render: (row) =>
            gradeNameById.get(String(row.gradeId)) ?? row.gradeId,
        },
        {
          key: "capacity",
          header: "Capacity",
          render: (row) => row.capacity,
        },
        {
          key: "students",
          header: "Current Students",
          render: (row) => row.currentStudentsCount,
        },
        {
          key: "availableSeats",
          header: "Available Seats",
          render: (row) => row.availableSeats,
        },
      ]}
      toFormValues={(row) => ({
        academicYearId: String(row.academicYearId),
        gradeId: String(row.gradeId),
        capacity: row.capacity,
      })}
      buildPayload={(values) => ({
        academicYearId: Number(values.academicYearId),
        gradeId: Number(values.gradeId),
        capacity: Number(values.capacity),
      })}
      buildUpdatePayload={(values, row) => {
        const capacity = Number(values.capacity);

        return capacity === row.capacity
          ? {}
          : {
              capacity,
            };
      }}
      emptyTitle="No classrooms found"
      emptyDescription="Open the first classroom for an academic year and grade."
      deleteTitle="Delete classroom?"
      deleteDescription={(row) =>
        `The classroom "${row.name}" will be permanently deleted.`
      }
    />
  );
}
