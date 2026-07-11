import { CrudPage } from "../../shared/components/CrudPage";

import {
  useClassrooms,
  useCreateClassroom,
  useUpdateClassroom,
} from "../hooks/useClassrooms";
import type {
  Classroom,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "../types/classroom.types";

export function ClassroomsPage() {
  const {
    data: classrooms = [],
    isLoading,
  } = useClassrooms();

  const createClassroomMutation =
    useCreateClassroom();

  const updateClassroomMutation =
    useUpdateClassroom();

  return (
    <CrudPage<
      Classroom,
      CreateClassroomPayload,
      UpdateClassroomPayload
    >
      title="Classrooms"
      description="Open and manage classrooms for each grade and academic year."
      addLabel="Add Classroom"
      rows={classrooms}
      isLoading={isLoading}
      createMutation={
        createClassroomMutation
      }
      updateMutation={
        updateClassroomMutation
      }
      fields={[
        {
          name: "academicYearId",
          label: "Academic Year ID",
          type: "number",
          defaultValue: 1,
        },
        {
          name: "gradeId",
          label: "Grade ID",
          type: "number",
          defaultValue: 1,
        },
        {
          name: "capacity",
          label: "Capacity",
          type: "number",
          defaultValue: 30,
        },
      ]}
      columns={[
        {
          key: "name",
          header: "Name",
          render: (row) => row.name,
        },
        {
          key: "academicYearId",
          header: "Academic Year",
          render: (row) =>
            row.academicYearId,
        },
        {
          key: "gradeId",
          header: "Grade",
          render: (row) => row.gradeId,
        },
        {
          key: "capacity",
          header: "Capacity",
          render: (row) => row.capacity,
        },
        {
          key: "currentStudentsCount",
          header: "Students",
          render: (row) =>
            row.currentStudentsCount,
        },
        {
          key: "availableSeats",
          header: "Available Seats",
          render: (row) =>
            row.availableSeats,
        },
      ]}
      toFormValues={(row) => ({
        academicYearId:
          row.academicYearId,
        gradeId: row.gradeId,
        capacity: row.capacity,
      })}
      buildPayload={(values) => ({
        academicYearId: Number(
          values.academicYearId,
        ),

        gradeId: Number(
          values.gradeId,
        ),

        capacity: Number(
          values.capacity,
        ),
      })}
      buildUpdatePayload={(
        values,
        currentClassroom,
      ) => {
        const payload: UpdateClassroomPayload =
          {};

        const nextCapacity = Number(
          values.capacity,
        );

        if (
          nextCapacity !==
          currentClassroom.capacity
        ) {
          payload.capacity = nextCapacity;
        }

        return payload;
      }}
    />
  );
}