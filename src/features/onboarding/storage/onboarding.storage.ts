const STORAGE_PREFIX = "aisha:onboarding:v1";

function key(userId: string | number | undefined) {
  return `${STORAGE_PREFIX}:${userId ?? "local-user"}`;
}

type StoredState = {
  completed: boolean;
  visitedStepIds: string[];
  dismissedTipIds: string[];
};

const emptyState: StoredState = {
  completed: false,
  visitedStepIds: [],
  dismissedTipIds: [],
};

export const onboardingStorage = {
  get(userId?: string | number): StoredState {
    try {
      const raw = localStorage.getItem(key(userId));
      return raw ? { ...emptyState, ...JSON.parse(raw) } : emptyState;
    } catch {
      return emptyState;
    }
  },

  set(userId: string | number | undefined, value: StoredState) {
    localStorage.setItem(key(userId), JSON.stringify(value));
  },

  reset(userId?: string | number) {
    localStorage.removeItem(key(userId));
  },
};

export const ONBOARDING_RESTART_EVENT = "aisha:onboarding:restart";
