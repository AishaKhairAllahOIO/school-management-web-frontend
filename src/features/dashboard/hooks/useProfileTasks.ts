import { profileTasksMock } from "../mocks/profileTasks.mock";

export function useProfileTasks() {
  return {
    tasks: profileTasksMock,
    isLoading: false,
    isError: false,
  };
}