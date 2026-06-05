import { subjectsMock } from "@/features/academics/subjects/mocks/subjects.mock";
import type {
  CreateSubjectPayload,
  Subject,
  UpdateSubjectPayload,
} from "@/features/academics/subjects/types/subject.types";

const USE_MOCK_API = true;

let mockDatabase: Subject[] = subjectsMock;

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSubjects(): Promise<Subject[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/academics/subjects");

  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }

  return response.json();
}

export async function createSubject(
  payload: CreateSubjectPayload
): Promise<Subject> {
  if (USE_MOCK_API) {
    await wait();

    const subject: Subject = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase = [...mockDatabase, subject];

    return subject;
  }

  const response = await fetch("/api/academics/subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create subject");
  }

  return response.json();
}

export async function updateSubject(
  subjectId: string,
  payload: UpdateSubjectPayload
): Promise<Subject> {
  if (USE_MOCK_API) {
    await wait();

    let updatedSubject: Subject | undefined;

    mockDatabase = mockDatabase.map((subject) => {
      if (subject.id !== subjectId) return subject;

      updatedSubject = {
        ...subject,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedSubject;
    });

    if (!updatedSubject) {
      throw new Error("Subject not found");
    }

    return updatedSubject;
  }

  const response = await fetch(`/api/academics/subjects/${subjectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update subject");
  }

  return response.json();
}

export async function deleteSubject(subjectId: string): Promise<void> {
  if (USE_MOCK_API) {
    await wait();
    mockDatabase = mockDatabase.filter((subject) => subject.id !== subjectId);
    return;
  }

  const response = await fetch(`/api/academics/subjects/${subjectId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete subject");
  }
}