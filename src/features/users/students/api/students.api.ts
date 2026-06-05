import { studentsMock } from "@/features/users/students/mocks/students.mock";
import type { StudentUser } from "@/features/users/students/types/student.types";

const USE_MOCK_API = true;

let mockDatabase: StudentUser[] = studentsMock;

function wait(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getStudents(): Promise<StudentUser[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/users/students");

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
}