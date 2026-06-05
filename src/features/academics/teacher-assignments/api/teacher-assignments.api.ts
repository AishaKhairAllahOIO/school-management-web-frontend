import { teacherAssignmentsMock } from "@/features/academics/teacher-assignments/mocks/teacher-assignments.mock";
import type {
  CreateTeacherAssignmentPayload,
  TeacherAssignment,
  UpdateTeacherAssignmentPayload,
} from "@/features/academics/teacher-assignments/types/teacher-assignment.types";

const USE_MOCK_API = true;

let mockDatabase: TeacherAssignment[] = teacherAssignmentsMock;

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTeacherAssignments(): Promise<TeacherAssignment[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/academics/teacher-assignments");

  if (!response.ok) {
    throw new Error("Failed to fetch teacher assignments");
  }

  return response.json();
}

export async function createTeacherAssignment(
  payload: CreateTeacherAssignmentPayload
): Promise<TeacherAssignment> {
  if (USE_MOCK_API) {
    await wait();

    const assignment: TeacherAssignment = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase = [...mockDatabase, assignment];

    return assignment;
  }

  const response = await fetch("/api/academics/teacher-assignments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create teacher assignment");
  }

  return response.json();
}

export async function updateTeacherAssignment(
  assignmentId: string,
  payload: UpdateTeacherAssignmentPayload
): Promise<TeacherAssignment> {
  if (USE_MOCK_API) {
    await wait();

    let updatedAssignment: TeacherAssignment | undefined;

    mockDatabase = mockDatabase.map((assignment) => {
      if (assignment.id !== assignmentId) return assignment;

      updatedAssignment = {
        ...assignment,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedAssignment;
    });

    if (!updatedAssignment) {
      throw new Error("Teacher assignment not found");
    }

    return updatedAssignment;
  }

  const response = await fetch(
    `/api/academics/teacher-assignments/${assignmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update teacher assignment");
  }

  return response.json();
}

export async function deleteTeacherAssignment(
  assignmentId: string
): Promise<void> {
  if (USE_MOCK_API) {
    await wait();
    mockDatabase = mockDatabase.filter(
      (assignment) => assignment.id !== assignmentId
    );
    return;
  }

  const response = await fetch(
    `/api/academics/teacher-assignments/${assignmentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete teacher assignment");
  }
}