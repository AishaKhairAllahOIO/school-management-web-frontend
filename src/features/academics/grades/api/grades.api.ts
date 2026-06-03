import { gradesMock } from "@/features/academics/grades/mocks/grades.mock";
import type {
  CreateGradePayload,
  Grade,
  UpdateGradePayload,
} from "@/features/academics/grades/types/grade.types";

const USE_MOCK_API = true;

let mockDatabase: Grade[] = gradesMock;

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getGrades(): Promise<Grade[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/academics/grades");

  if (!response.ok) {
    throw new Error("Failed to fetch grades");
  }

  return response.json();
}

export async function createGrade(payload: CreateGradePayload): Promise<Grade> {
  if (USE_MOCK_API) {
    await wait();

    const grade: Grade = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase = [...mockDatabase, grade];

    return grade;
  }

  const response = await fetch("/api/academics/grades", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create grade");
  }

  return response.json();
}

export async function updateGrade(
  gradeId: string,
  payload: UpdateGradePayload
): Promise<Grade> {
  if (USE_MOCK_API) {
    await wait();

    let updatedGrade: Grade | undefined;

    mockDatabase = mockDatabase.map((grade) => {
      if (grade.id !== gradeId) return grade;

      updatedGrade = {
        ...grade,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedGrade;
    });

    if (!updatedGrade) {
      throw new Error("Grade not found");
    }

    return updatedGrade;
  }

  const response = await fetch(`/api/academics/grades/${gradeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update grade");
  }

  return response.json();
}

export async function deleteGrade(gradeId: string): Promise<void> {
  if (USE_MOCK_API) {
    await wait();
    mockDatabase = mockDatabase.filter((grade) => grade.id !== gradeId);
    return;
  }

  const response = await fetch(`/api/academics/grades/${gradeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete grade");
  }
}