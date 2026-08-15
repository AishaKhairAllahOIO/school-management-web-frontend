import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  isCompleted: boolean;
  isRunning: boolean;

  startOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore =
  create<OnboardingState>()(
    persist(
      (set) => ({
        isCompleted: false,
        isRunning: false,

        startOnboarding: () =>
          set({
            isRunning: true,
          }),

        completeOnboarding: () =>
          set({
            isCompleted: true,
            isRunning: false,
          }),

        resetOnboarding: () =>
          set({
            isCompleted: false,
            isRunning: true,
          }),
      }),
      {
        name: "app-onboarding-storage",
      },
    ),
  );