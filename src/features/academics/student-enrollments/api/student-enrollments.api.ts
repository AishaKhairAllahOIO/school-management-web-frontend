import { studentEnrollmentsMock } from "@/features/academics/student-enrollments/mocks/student-enrollments.mock";
import type {
  CreateStudentEnrollmentPayload,
  StudentEnrollment,
  UpdateStudentEnrollmentPayload,
} from "@/features/academics/student-enrollments/types/student-enrollment.types";

const USE_MOCK_API = true;

let mockDatabase: StudentEnrollment[] = studentEnrollmentsMock;

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getStudentEnrollments(): Promise<StudentEnrollment[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/academics/student-enrollments");

  if (!response.ok) {
    throw new Error("Failed to fetch student enrollments");
  }

  return response.json();
}

export async function createStudentEnrollment(
  payload: CreateStudentEnrollmentPayload
): Promise<StudentEnrollment> {
  if (USE_MOCK_API) {
    await wait();

    const enrollment: StudentEnrollment = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase = [...mockDatabase, enrollment];

    return enrollment;
  }

  const response = await fetch("/api/academics/student-enrollments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create student enrollment");
  }

  return response.json();
}

export async function updateStudentEnrollment(
  enrollmentId: string,
  payload: UpdateStudentEnrollmentPayload
): Promise<StudentEnrollment> {
  if (USE_MOCK_API) {
    await wait();

    let updatedEnrollment: StudentEnrollment | undefined;

    mockDatabase = mockDatabase.map((enrollment) => {
      if (enrollment.id !== enrollmentId) return enrollment;

      updatedEnrollment = {
        ...enrollment,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedEnrollment;
    });

    if (!updatedEnrollment) {
      throw new Error("Student enrollment not found");
    }

    return updatedEnrollment;
  }

  const response = await fetch(
    `/api/academics/student-enrollments/${enrollmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update student enrollment");
  }

  return response.json();
}

export async function deleteStudentEnrollment(
  enrollmentId: string
): Promise<void> {
  if (USE_MOCK_API) {
    await wait();

    mockDatabase = mockDatabase.filter(
      (enrollment) => enrollment.id !== enrollmentId
    );

    return;
  }

  const response = await fetch(
    `/api/academics/student-enrollments/${enrollmentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete student enrollment");
  }
}