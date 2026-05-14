export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },

  students: {
    all: ["students"] as const,
    lists: () => [...queryKeys.students.all, "list"] as const,
    list: (filters?: object) => [...queryKeys.students.lists(), filters] as const,
    details: () => [...queryKeys.students.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.students.details(), id] as const,
  },

  teachers: {
    all: ["teachers"] as const,
    lists: () => [...queryKeys.teachers.all, "list"] as const,
    detail: (id: string) => [...queryKeys.teachers.all, "detail", id] as const,
  },
};