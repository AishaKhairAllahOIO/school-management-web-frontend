import { gradeSubjectsMock } from "@/features/academics/grade-subjects/mocks/grade-subjects.mock";
import type {
  CreateGradeSubjectPayload,
  GradeSubject,
  UpdateGradeSubjectPayload,
} from "@/features/academics/grade-subjects/types/grade-subject.types";

const USE_MOCK_API = true;

let mockDatabase: GradeSubject[] = gradeSubjectsMock;

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getGradeSubjects(): Promise<GradeSubject[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/academics/grade-subjects");

  if (!response.ok) {
    throw new Error("Failed to fetch grade subjects");
  }

  return response.json();
}

export async function createGradeSubject(
  payload: CreateGradeSubjectPayload
): Promise<GradeSubject> {
  if (USE_MOCK_API) {
    await wait();

    const item: GradeSubject = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase = [...mockDatabase, item];

    return item;
  }

  const response = await fetch("/api/academics/grade-subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create grade subject");
  }

  return response.json();
}

export async function updateGradeSubject(
  gradeSubjectId: string,
  payload: UpdateGradeSubjectPayload
): Promise<GradeSubject> {
  if (USE_MOCK_API) {
    await wait();

    let updatedItem: GradeSubject | undefined;

    mockDatabase = mockDatabase.map((item) => {
      if (item.id !== gradeSubjectId) return item;

      updatedItem = {
        ...item,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedItem;
    });

    if (!updatedItem) {
      throw new Error("Grade subject not found");
    }

    return updatedItem;
  }

  const response = await fetch(`/api/academics/grade-subjects/${gradeSubjectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update grade subject");
  }

  return response.json();
}

export async function deleteGradeSubject(
  gradeSubjectId: string
): Promise<void> {
  if (USE_MOCK_API) {
    await wait();
    mockDatabase = mockDatabase.filter((item) => item.id !== gradeSubjectId);
    return;
  }

  const response = await fetch(`/api/academics/grade-subjects/${gradeSubjectId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete grade subject");
  }
}