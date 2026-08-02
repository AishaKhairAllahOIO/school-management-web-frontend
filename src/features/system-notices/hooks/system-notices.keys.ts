const SYSTEM_NOTICES_ROOT_KEY =
  "system-notices" as const;

export const systemNoticesKeys = {
  all: [
    SYSTEM_NOTICES_ROOT_KEY,
  ] as const,

  lists: () =>
    [
      SYSTEM_NOTICES_ROOT_KEY,
      "list",
    ] as const,

  list: (page = 1) =>
    [
      SYSTEM_NOTICES_ROOT_KEY,
      "list",
      {
        page,
      },
    ] as const,

  unreadCount: () =>
    [
      SYSTEM_NOTICES_ROOT_KEY,
      "unread-count",
    ] as const,
};