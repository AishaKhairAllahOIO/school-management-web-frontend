import type { LucideIcon } from "lucide-react";


type ProfileInfoItemProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};



export function ProfileInfoItem({
  label,
  value,
  icon: Icon,
}: ProfileInfoItemProps) {


  return (

    <div
      className="
      group
      flex
      items-center
      gap-4
      rounded-[22px]
      border
      border-border/50
      bg-card
      px-4
      py-3.5
      transition
      hover:border-primary/20
      hover:bg-primary/[0.02]
      "
    >


      <span
        className="
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-2xl
        bg-primary/10
        text-primary
        transition
        group-hover:bg-primary/15
        "
      >

        <Icon
          size={18}
          strokeWidth={2}
        />

      </span>




      <div
        className="
        min-w-0
        "
      >

        <p
          className="
          text-[11px]
          font-semibold
          tracking-wide
          text-muted-foreground
          "
        >
          {label}
        </p>


        <p
          className="
          mt-1
          truncate
          text-sm
          font-bold
          text-foreground
          "
        >
          {value || "—"}
        </p>


      </div>


    </div>

  );
}