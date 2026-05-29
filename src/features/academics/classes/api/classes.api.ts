import { classesMock } from "../mocks/classes.mock";
import type { ClassSchema } from "../schemas/class.schema";

export const getClasses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(classesMock);
    }, 500);
  });
};

export const createClass = async (
  payload: ClassSchema
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newClass = {
        id: crypto.randomUUID(),
        ...payload,
        // Provide defaults for required ClassItem fields
        level: (payload as any).level ?? 1,
        studentsCount: 0,
        createdAt: new Date().toISOString(),
      };

      classesMock.unshift(newClass as any);

      resolve(newClass);
    }, 500);
  });
};