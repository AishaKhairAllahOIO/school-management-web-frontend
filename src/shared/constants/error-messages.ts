export const ERROR_MESSAGES = {
  GENERAL: {
    DEFAULT: "Something went wrong",
    SERVER_ERROR: "Server error occurred",
    NETWORK_ERROR: "Network connection failed",
    UNEXPECTED_ERROR: "Unexpected error occurred",
  },

  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password",
    SESSION_EXPIRED: "Your session has expired",
    UNAUTHORIZED: "Please login again",
    ACCESS_DENIED: "Access denied",
  },

  STUDENTS: {
    NOT_FOUND: "Student not found",
    ALREADY_EXISTS: "Student already exists",
    CLASSROOM_FULL: "Classroom capacity exceeded",
  },

  ATTENDANCE: {
    LIMIT_EXCEEDED: "Attendance limit exceeded",
  },

  FINANCE: {
    INVALID_PAYMENT: "Payment exceeds remaining amount",
    PAYMENT_REQUIRED: "Payment is required",
  },
} as const;