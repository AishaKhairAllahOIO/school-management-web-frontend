import { useProfile } from "@/features/profile/hooks/use-my-profile";


export function useCurrentUser() {

  const {
    user,
    isLoading,
  } = useProfile();


  return {
    user,
    isLoading,
  };

}