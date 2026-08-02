import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userActivitiesService } from "../services/user-activities.service";

export function useUserActivities(role: "student" | "parent" = "student") {
  const queryClient = useQueryClient();


  const activitiesQuery = useQuery({
    queryKey: ["user-activities", role],
    queryFn: () => 
      role === "student" 
        ? userActivitiesService.getMyActivities() 
        : userActivitiesService.getChildActivities(),
  });


  const unreadCountQuery = useQuery({
    queryKey: ["user-activities-unread"],
    queryFn: () => userActivitiesService.getUnreadCount(),
    refetchInterval: 60000,  
  });


  const markAsReadMutation = useMutation({
    mutationFn: () => userActivitiesService.markAllAsRead(),
    onSuccess: () => {
      queryClient.setQueryData(["user-activities-unread"], 0);
      queryClient.invalidateQueries({ queryKey: ["user-activities"] });
    },
  });

  return {
    activities: activitiesQuery.data ?? [],
    isLoadingActivities: activitiesQuery.isLoading,
    
    unreadCount: unreadCountQuery.data ?? 0,
    
    markAllAsRead: markAsReadMutation,
    isMarkingRead: markAsReadMutation.isPending,
  };
}