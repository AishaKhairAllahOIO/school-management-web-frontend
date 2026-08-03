import { useMemo, type ReactNode } from "react";

import { useAcademicYears } from "@/features/settings/academic/hooks/useAcademicSettings";
import { useStaffByRole } from "@/features/users/staff/hooks/useStaff";

import { useGrades } from "../../grades/hooks/useGrades";
import { CrudPage } from "../../shared/components/CrudPage";

import { gradeConfigurationApi } from "../api/gradeConfiguration.api";

import {
  useCreateGradeConfiguration,
  useDeleteGradeConfiguration,
  useGradeConfigurations,
  useUpdateGradeConfiguration,
} from "../hooks/useGradeConfigurations";

import type {
  CreateGradeConfigurationPayload,
  UpdateGradeConfigurationPayload,
} from "../types/grade-configuration.types";

const ADVISERS_PER_PAGE = 500;

type TextCellProps = {
  value: ReactNode;
  caption: string;
  emphasis?: "primary" | "secondary";
};

function TextCell({
  value,
  caption,
  emphasis = "primary",
}: TextCellProps) {
  return (
    <div className="min-w-[150px] py-1.5">
      <p
        className={[
          "truncate tracking-[-0.015em]",
          emphasis === "primary"
            ? "text-[14px] font-semibold text-foreground"
            : "text-[14px] font-medium text-foreground/85",
        ].join(" ")}
      >
        {value}
      </p>

      <p className="mt-1 truncate text-[11px] font-medium leading-4 text-muted-foreground/75">
        {caption}
      </p>
    </div>
  );
}

type MetricCellProps = {
  value: number;
  caption: string;
  tone?: "accent" | "neutral";
};

function MetricCell({
  value,
  caption,
  tone = "neutral",
}: MetricCellProps) {
  return (
    <div className="min-w-[120px] py-1.5">
      <p
        className={[
          "text-[18px] font-semibold leading-none tracking-[-0.035em]",
          tone === "accent"
            ? "text-[var(--academic-accent)]"
            : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>

      <p className="mt-2 truncate text-[11px] font-medium leading-4 text-muted-foreground/75">
        {caption}
      </p>
    </div>
  );
}

export function GradeConfigurationsPage() {
  const configurationsQuery =
    useGradeConfigurations();

  const yearsQuery = useAcademicYears();
  const gradesQuery = useGrades();
  const advisersQuery = useStaffByRole(
    "adviser",
    1,
    ADVISERS_PER_PAGE,
  );

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

  const adviserOptions = useMemo(() => {
    const advisers =
      advisersQuery.data?.data ?? [];

    return advisers
      .filter((adviser) => !adviser.isDeleted)
      .map((adviser) => {
        const fullName =
          adviser.fullName.trim() ||
          [
            adviser.firstName,
            adviser.fatherName,
            adviser.lastName,
          ]
            .filter(Boolean)
            .join(" ");

        return {
          value: String(adviser.id),
          label:
            fullName ||
            `Supervisor ${String(adviser.id)}`,
        };
      })
      .sort((first, second) =>
        first.label.localeCompare(second.label),
      );
  }, [advisersQuery.data]);

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

  const adviserNameById = useMemo(
    () =>
      new Map(
        adviserOptions.map((option) => [
          option.value,
          option.label,
        ]),
      ),
    [adviserOptions],
  );

  const isLoading =
    configurationsQuery.isLoading ||
    yearsQuery.isLoading ||
    gradesQuery.isLoading ||
    advisersQuery.isLoading;

  const isError =
    configurationsQuery.isError ||
    yearsQuery.isError ||
    gradesQuery.isError ||
    advisersQuery.isError;

  return (
    <CrudPage
      title="Grade Configurations"
      description="Plan classrooms and assign a supervisor for each grade in an academic year."
      addLabel="Add Configuration"
      rows={configurationsQuery.data ?? []}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => {
        void Promise.all([
          configurationsQuery.refetch(),
          yearsQuery.refetch(),
          gradesQuery.refetch(),
          advisersQuery.refetch(),
        ]);
      }}
      loadEntity={gradeConfigurationApi.getById}
      createMutation={
        useCreateGradeConfiguration()
      }
      updateMutation={
        useUpdateGradeConfiguration()
      }
      deleteMutation={
        useDeleteGradeConfiguration()
      }
      fields={[
        {
          name: "academicYearId",
          label: "Academic Year",
          type: "select",
          options: yearOptions,
          defaultValue:
            yearOptions[0]?.value ?? "",
          required: true,
          disabledOnEdit: true,
          helperText:
            "The academic year cannot be changed after creation.",
        },
        {
          name: "gradeId",
          label: "Grade",
          type: "select",
          options: gradeOptions,
          defaultValue:
            gradeOptions[0]?.value ?? "",
          required: true,
          disabledOnEdit: true,
          helperText:
            "The grade cannot be changed after creation.",
        },
        {
          name: "supervisorId",
          label: "Supervisor",
          type: "select",
          options: adviserOptions,
          defaultValue:
            adviserOptions[0]?.value ?? "",
          required: true,
          helperText:
            adviserOptions.length > 0
              ? "Select the supervisor responsible for this grade."
              : "No supervisors are currently available. Add a supervisor before creating a grade configuration.",
        },
        {
          name: "plannedClassroomsCount",
          label: "Planned Classrooms",
          type: "number",
          defaultValue: 1,
          required: true,
          min: 1,
        },
      ]}
      columns={[
        {
          key: "year",
          header: "Academic Year",
          render: (row) => (
            <TextCell
              value={yearNameById.get(String(row.academicYearId)) ?? "Unknown year"}
              caption="Academic cycle"
            />
          ),
          searchableText: (row) =>
            yearNameById.get(String(row.academicYearId)) ?? "",
        },
        {
          key: "grade",
          header: "Grade",
          render: (row) => (
            <TextCell
              value={gradeNameById.get(String(row.gradeId)) ?? "Unknown grade"}
              caption="Configured grade"
            />
          ),
          searchableText: (row) =>
            gradeNameById.get(String(row.gradeId)) ?? "",
        },
        {
          key: "supervisor",
          header: "Supervisor",
          render: (row) => (
            <TextCell
              value={adviserNameById.get(String(row.supervisorId)) ?? "Unavailable"}
              caption="Responsible adviser"
              emphasis="secondary"
            />
          ),
          searchableText: (row) =>
            adviserNameById.get(String(row.supervisorId)) ?? "",
        },
        {
          key: "classrooms",
          header: "Classrooms",
          render: (row) => (
            <MetricCell
              value={row.actualClassroomsCount}
              caption={`${row.plannedClassroomsCount} planned`}
              tone="accent"
            />
          ),
        },
        {
          key: "students",
          header: "Students",
          render: (row) => (
            <MetricCell
              value={row.actualStudentsCount}
              caption={`${row.plannedStudentsCapacity} capacity`}
            />
          ),
        },
      ]}
      toFormValues={(row) => ({
        academicYearId: String(
          row.academicYearId,
        ),
        gradeId: String(row.gradeId),
        supervisorId: String(
          row.supervisorId,
        ),
        plannedClassroomsCount:
          row.plannedClassroomsCount,
      })}
      buildPayload={(values) => {
        const payload: CreateGradeConfigurationPayload =
          {
            academicYearId: Number(
              values.academicYearId,
            ),
            gradeId: Number(values.gradeId),
            supervisorId: Number(
              values.supervisorId,
            ),
            plannedClassroomsCount:
              Number(
                values.plannedClassroomsCount,
              ),
          };

        return payload;
      }}
      buildUpdatePayload={(
        values,
        row,
      ) => {
        const payload: UpdateGradeConfigurationPayload =
          {};

        const supervisorId = Number(
          values.supervisorId,
        );

        const plannedClassroomsCount =
          Number(
            values.plannedClassroomsCount,
          );

        if (
          supervisorId !==
          Number(row.supervisorId)
        ) {
          payload.supervisorId =
            supervisorId;
        }

        if (
          plannedClassroomsCount !==
          row.plannedClassroomsCount
        ) {
          payload.plannedClassroomsCount =
            plannedClassroomsCount;
        }

        return payload;
      }}
      emptyTitle="No grade configurations found"
      emptyDescription={
        adviserOptions.length === 0
          ? "Add at least one supervisor before creating a grade configuration."
          : "Create a configuration to plan classrooms for a grade and academic year."
      }
      deleteTitle="Delete grade configuration?"
      deleteDescription={(row) =>
        `The planning configuration for grade ${
          gradeNameById.get(
            String(row.gradeId),
          ) ?? "the selected grade"
        } will be permanently deleted.`
      }
    />
  );
}