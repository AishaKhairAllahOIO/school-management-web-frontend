export type ProfileTask = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type ProfileTaskStorage = {
  type: "local" | "session";
  read: () => ProfileTask[];
  write: (
    tasks: ProfileTask[],
  ) => void;
  clear: () => void;
};

const REMEMBER_KEYS = [
  "aisha:remember-me",
  "rememberMe",
  "remember_me",
];

const LOCAL_AUTH_KEYS = [
  "auth_token",
  "access_token",
  "token",
];

export function getProfileTaskStorage(
  userId: string,
): ProfileTaskStorage {
  const useLocalStorage =
    shouldUseLocalStorage();

  const storage =
    useLocalStorage
      ? window.localStorage
      : window.sessionStorage;

  const storageKey = `aisha:profile-tasks:${userId}`;

  return {
    type: useLocalStorage
      ? "local"
      : "session",

    read() {
      try {
        const storedValue =
          storage.getItem(
            storageKey,
          );

        if (!storedValue) {
          return [];
        }

        const parsedValue =
          JSON.parse(
            storedValue,
          );

        if (
          !Array.isArray(
            parsedValue,
          )
        ) {
          return [];
        }

        return parsedValue.filter(
          isProfileTask,
        );
      } catch {
        return [];
      }
    },

    write(tasks) {
      try {
        storage.setItem(
          storageKey,
          JSON.stringify(tasks),
        );
      } catch {
        return;
      }
    },

    clear() {
      try {
        storage.removeItem(
          storageKey,
        );
      } catch {
        return;
      }
    },
  };
}

function shouldUseLocalStorage(): boolean {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  const rememberedValue =
    findRememberValue();

  if (
    rememberedValue !== null
  ) {
    return parseBoolean(
      rememberedValue,
    );
  }

  return LOCAL_AUTH_KEYS.some(
    (key) =>
      Boolean(
        window.localStorage.getItem(
          key,
        ),
      ),
  );
}

function findRememberValue():
  | string
  | null {
  for (const key of REMEMBER_KEYS) {
    const localValue =
      window.localStorage.getItem(
        key,
      );

    if (
      localValue !== null
    ) {
      return localValue;
    }

    const sessionValue =
      window.sessionStorage.getItem(
        key,
      );

    if (
      sessionValue !== null
    ) {
      return sessionValue;
    }
  }

  return null;
}

function parseBoolean(
  value: string,
): boolean {
  const normalizedValue =
    value
      .trim()
      .toLowerCase();

  return [
    "true",
    "1",
    "yes",
    "on",
    "remembered",
  ].includes(
    normalizedValue,
  );
}

function isProfileTask(
  value: unknown,
): value is ProfileTask {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const task =
    value as Partial<ProfileTask>;

  return (
    typeof task.id ===
      "string" &&
    typeof task.title ===
      "string" &&
    typeof task.completed ===
      "boolean" &&
    typeof task.createdAt ===
      "number"
  );
}