export type ScheduleGenerationResult = {
  scheduleId: string;
};

export type ScheduleGenerationStatus =
  | "idle"
  | "generating"
  | "generated"
  | "regenerating"
  | "regenerated"
  | "error";

export type ScheduleGenerationError = {
  message: string;
  code?: string;
};

export type GenerateScheduleResponse = {
  scheduleId: string;
  message?: string;
};

export type RegenerateScheduleResponse = {
  scheduleId: string;
  message?: string;
};