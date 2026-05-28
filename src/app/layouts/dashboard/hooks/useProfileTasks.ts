import { profileTasksMock } from "../../../../features/dashboard/mocks/profileTasks.mock";

export function useProfileTasks() {
  return {
    tasks: profileTasksMock,
    isLoading: false,
    isError: false,
  };
}