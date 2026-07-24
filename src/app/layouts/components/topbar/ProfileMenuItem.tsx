import type { ProfileMenuItemProps } from "./topbar.types";


export function ProfileMenuItem({
  title,
  icon: Icon,
  onClick,
}: ProfileMenuItemProps) {


  return (

    <button
      type="button"
      onClick={onClick}
      className="
      flex
      h-[42px]
      w-full
      items-center
      gap-[12px]
      rounded-[13px]
      px-[9px]
      text-start
      text-[13px]
      font-semibold
      text-topbar-text
      transition
      hover:bg-topbar-soft
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-ring
      "
    >

      <span
        className="
        flex
        h-[30px]
        w-[30px]
        items-center
        justify-center
        rounded-[10px]
        bg-topbar-soft
        text-topbar-text
        "
      >

        <Icon
          aria-hidden="true"
          size={15}
          strokeWidth={2.05}
        />

      </span>


      {title}


    </button>

  );
}