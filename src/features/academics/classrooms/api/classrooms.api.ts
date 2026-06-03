import { classroomsMock } from "@/features/academics/classrooms/mocks/classrooms.mock";
import type {
  Classroom,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "@/features/academics/classrooms/types/classroom.types";

const USE_MOCK_API = true;

let mockDatabase: Classroom[] = classroomsMock;

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getClassrooms(): Promise<Classroom[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/academics/classrooms");

  if (!response.ok) {
    throw new Error("Failed to fetch classrooms");
  }

  return response.json();
}

export async function createClassroom(
  payload: CreateClassroomPayload
): Promise<Classroom> {
  if (USE_MOCK_API) {
    await wait();

    const classroom: Classroom = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase = [...mockDatabase, classroom];

    return classroom;
  }

  const response = await fetch("/api/academics/classrooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create classroom");
  }

  return response.json();
}

export async function updateClassroom(
  classroomId: string,
  payload: UpdateClassroomPayload
): Promise<Classroom> {
  if (USE_MOCK_API) {
    await wait();

    let updatedClassroom: Classroom | undefined;

    mockDatabase = mockDatabase.map((classroom) => {
      if (classroom.id !== classroomId) return classroom;

      updatedClassroom = {
        ...classroom,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedClassroom;
    });

    if (!updatedClassroom) {
      throw new Error("Classroom not found");
    }

    return updatedClassroom;
  }

  const response = await fetch(`/api/academics/classrooms/${classroomId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update classroom");
  }

  return response.json();
}

export async function deleteClassroom(classroomId: string): Promise<void> {
  if (USE_MOCK_API) {
    await wait();
    mockDatabase = mockDatabase.filter(
      (classroom) => classroom.id !== classroomId
    );
    return;
  }

  const response = await fetch(`/api/academics/classrooms/${classroomId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete classroom");
  }
}