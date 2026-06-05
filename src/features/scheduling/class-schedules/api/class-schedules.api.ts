import { classSchedulesMock } from "@/features/scheduling/class-schedules/mocks/class-schedules.mock";
import type {
  ClassSchedule,
  CreateClassSchedulePayload,
  UpdateClassSchedulePayload,
} from "@/features/scheduling/class-schedules/types/class-schedule.types";

const USE_MOCK_API = true;

let mockDatabase: ClassSchedule[] = classSchedulesMock;

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getClassSchedules(): Promise<ClassSchedule[]> {
  if (USE_MOCK_API) {
    await wait();
    return mockDatabase;
  }

  const response = await fetch("/api/scheduling/class-schedules");

  if (!response.ok) {
    throw new Error("Failed to fetch class schedules");
  }

  return response.json();
}

export async function createClassSchedule(
  payload: CreateClassSchedulePayload
): Promise<ClassSchedule> {
  if (USE_MOCK_API) {
    await wait();

    const schedule: ClassSchedule = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase = [...mockDatabase, schedule];

    return schedule;
  }

  const response = await fetch("/api/scheduling/class-schedules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create class schedule");
  }

  return response.json();
}

export async function updateClassSchedule(
  scheduleId: string,
  payload: UpdateClassSchedulePayload
): Promise<ClassSchedule> {
  if (USE_MOCK_API) {
    await wait();

    let updatedSchedule: ClassSchedule | undefined;

    mockDatabase = mockDatabase.map((schedule) => {
      if (schedule.id !== scheduleId) return schedule;

      updatedSchedule = {
        ...schedule,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedSchedule;
    });

    if (!updatedSchedule) {
      throw new Error("Class schedule not found");
    }

    return updatedSchedule;
  }

  const response = await fetch(`/api/scheduling/class-schedules/${scheduleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update class schedule");
  }

  return response.json();
}

export async function deleteClassSchedule(scheduleId: string): Promise<void> {
  if (USE_MOCK_API) {
    await wait();
    mockDatabase = mockDatabase.filter((schedule) => schedule.id !== scheduleId);
    return;
  }

  const response = await fetch(`/api/scheduling/class-schedules/${scheduleId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete class schedule");
  }
}