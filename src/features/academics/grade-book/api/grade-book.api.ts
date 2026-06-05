import { gradeBookMock } from "@/features/academics/grade-book/mocks/grade-book.mock";
import type {
  CreateGradeBookEntryPayload,
  GradeBookEntry,
  UpdateGradeBookEntryPayload,
} from "@/features/academics/grade-book/types/grade-book.types";

const USE_MOCK_API = true;

let mockDatabase: GradeBookEntry[] = gradeBookMock;

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getGradeBookEntries(): Promise<GradeBookEntry[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/academics/grade-book");

  if (!response.ok) {
    throw new Error("Failed to fetch grade book entries");
  }

  return response.json();
}

export async function createGradeBookEntry(
  payload: CreateGradeBookEntryPayload
): Promise<GradeBookEntry> {
  if (USE_MOCK_API) {
    await wait();

    const entry: GradeBookEntry = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase = [...mockDatabase, entry];

    return entry;
  }

  const response = await fetch("/api/academics/grade-book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create grade book entry");
  }

  return response.json();
}

export async function updateGradeBookEntry(
  entryId: string,
  payload: UpdateGradeBookEntryPayload
): Promise<GradeBookEntry> {
  if (USE_MOCK_API) {
    await wait();

    let updatedEntry: GradeBookEntry | undefined;

    mockDatabase = mockDatabase.map((entry) => {
      if (entry.id !== entryId) return entry;

      updatedEntry = {
        ...entry,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedEntry;
    });

    if (!updatedEntry) {
      throw new Error("Grade book entry not found");
    }

    return updatedEntry;
  }

  const response = await fetch(`/api/academics/grade-book/${entryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update grade book entry");
  }

  return response.json();
}

export async function deleteGradeBookEntry(entryId: string): Promise<void> {
  if (USE_MOCK_API) {
    await wait();
    mockDatabase = mockDatabase.filter((entry) => entry.id !== entryId);
    return;
  }

  const response = await fetch(`/api/academics/grade-book/${entryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete grade book entry");
  }
}