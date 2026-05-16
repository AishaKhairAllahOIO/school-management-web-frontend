import { GraduationCap } from "lucide-react";
import { SidebarMenu } from "./SidebarMenu";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-80 flex-col bg-primary text-white lg:flex">
      <div className="flex h-24 items-center gap-4 border-b border-white/10 px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <GraduationCap className="h-7 w-7" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">School Desk</h1>
          <p className="text-sm text-white/70">Management System</p>
        </div>
      </div>

      <SidebarMenu />

      <div className="border-t border-white/10 p-5">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            AD
          </div>

          <div>
            <h3 className="text-sm font-semibold">Admin User</h3>
            <p className="text-xs text-white/70">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}