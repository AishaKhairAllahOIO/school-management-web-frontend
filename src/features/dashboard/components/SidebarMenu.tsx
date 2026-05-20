import { NavLink } from "react-router-dom";
import { sidebarItems } from "../config/sidebarItems";

type SidebarMenuProps =
{
  variant: "icons" | "labels";
};

export function SidebarMenu({ variant }: SidebarMenuProps) 
{
  if (variant === "icons") 
  {
    return (
      <nav className="flex flex-1 flex-col items-center gap-2 pt-1">
        {sidebarItems.map((item) => 
        {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/"}
              title={item.title}
              className={({ isActive }) =>
                [
                  "relative flex h-9 w-full items-center justify-center text-white/75 transition-all duration-200 hover:text-white",
                  isActive
                    ? "before:absolute before:-left-4 before:top-1/2 before:h-6 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-white"
                    : "hover:before:absolute hover:before:-left-4 hover:before:top-1/2 hover:before:h-6 hover:before:w-[3px] hover:before:-translate-y-1/2 hover:before:rounded-r-full hover:before:bg-white/55",
                ].join(" ")
              }
            >
              <Icon size={16} />
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-2 pt-1">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            [
              "relative flex h-9 items-center px-3 text-xs font-semibold transition-all duration-200",
              isActive
                ? "rounded-l-2xl rounded-r-none bg-background text-primary shadow-sm after:absolute after:-right-3 after:top-0 after:h-full after:w-3 after:bg-background"
                : "rounded-l-2xl rounded-r-none text-white/80 hover:bg-white/12 hover:text-white hover:after:absolute hover:after:-right-3 hover:after:top-0 hover:after:h-full hover:after:w-3 hover:after:bg-white/12",
            ].join(" ")
          }
        >
          <span className="relative z-10 truncate">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}