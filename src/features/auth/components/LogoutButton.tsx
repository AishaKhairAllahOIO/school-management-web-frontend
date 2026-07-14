import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useLogout } from "../hooks/use-logout";

export function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <Button type="button" variant="ghost" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      {logoutMutation.isPending ? "Signing out..." : "Logout"}
    </Button>
  );
}
