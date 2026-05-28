import { currentUserMock } from "@/app/layouts/dashboard/mocks/currentUser.mock";

export function useCurrentUser() {
  return {
    user: currentUserMock,
  };
}