import { currentUserMock } from "../mocks/currentUser.mock";

export function useCurrentUser() {
  return {
    user: currentUserMock,
    isLoading: false,
    isError: false,
  };
}