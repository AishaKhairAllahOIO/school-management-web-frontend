 export const apiEndpoints = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },

  USERS: {
    BASE: "/users",
    GET_BY_ID: (id: number) => `/users/${id}`,
  },

  STUDENTS: {
    BASE: "/students",
    CREATE: "/students",
    UPDATE: (id: number) => `/students/${id}`,
    DELETE: (id: number) => `/students/${id}`,
    LIST: "/students",
  },

  TEACHERS: {
    BASE: "/teachers",
    CREATE: "/teachers",
    UPDATE: (id: number) => `/teachers/${id}`,
    DELETE: (id: number) => `/teachers/${id}`,
    LIST: "/teachers",
  },

  FINANCE: {
    FEES: "/finance/fees",
    PAYMENTS: "/finance/payments",
  },

  ATTENDANCE: {
    STUDENTS: "/attendance/students",
    TEACHERS: "/attendance/teachers",
  },
} as const;
