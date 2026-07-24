import { Bell } from "lucide-react";
import { useRef } from "react";

import { useNotifications } from "@/app/layouts/hooks/useNotifications";
import { useLocale } from "@/app/providers/locale";
import { useDismissibleLayer } from "@/shared/hooks/use-dismissible-layer";

import { TOPBAR_ICON_BUTTON_CLASS_NAME } from "./topbar.constants";
import type { TopbarMenuProps } from "./topbar.types";


export function NotificationsMenu({
  isOpen,
  onToggle,
  onClose,
}: TopbarMenuProps) {


  const containerRef =
    useRef<HTMLDivElement>(null);


  const {
    notifications,
    unreadCount,
  } = useNotifications();


  const { t } =
    useLocale();



  useDismissibleLayer({
    ref: containerRef,
    enabled: isOpen,
    onDismiss: onClose,
  });



  return (

    <div
      ref={containerRef}
      className="relative"
    >



      <button
        type="button"
        onClick={onToggle}
        aria-label={
          t.layout.topbar.notifications
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={
          TOPBAR_ICON_BUTTON_CLASS_NAME
        }
      >

        <Bell
          aria-hidden="true"
          size={17}
          strokeWidth={2.1}
        />



        {unreadCount > 0 && (

          <span
            className="
            absolute
            -end-[4px]
            -top-[5px]
            flex
            h-[18px]
            min-w-[18px]
            items-center
            justify-center
            rounded-full
            bg-primary
            px-1
            text-[10px]
            font-bold
            leading-none
            text-primary-foreground
            ring-[3px]
            ring-topbar-surface
            "
          >
            {unreadCount}
          </span>

        )}


      </button>





      {isOpen && (

        <div
          role="menu"
          className="
          topbar-menu-shadow
          absolute
          end-0
          top-full
          z-50
          mt-3
          w-[340px]
          rounded-[22px]
          border
          border-topbar-border/80
          bg-topbar-surface/95
          p-4
          backdrop-blur-2xl
          "
        >



          <div className="mb-4">


            <h2
              className="
              text-[14px]
              font-bold
              text-topbar-title
              "
            >

              {
                t.layout.topbar
                  .notificationsTitle
              }

            </h2>



            <p
              className="
              mt-1
              text-[12px]
              text-topbar-subtle
              "
            >

              {
                t.layout.topbar
                  .unreadUpdates
                  .replace(
                    "{{count}}",
                    String(unreadCount),
                  )
              }

            </p>


          </div>





          <div
            className="
            max-h-[280px]
            space-y-2
            overflow-y-auto
            pe-1
            "
          >


            {notifications.length > 0 ? (


              notifications.map(
                (item) => (

                  <article
                    key={item.id}
                    className="
                    rounded-[16px]
                    bg-topbar-soft
                    p-3
                    transition
                    hover:bg-topbar-soft-hover
                    "
                  >


                    <p
                      className="
                      truncate
                      text-[12px]
                      font-bold
                      text-topbar-text
                      "
                    >
                      {item.title}
                    </p>



                    <p
                      className="
                      mt-1
                      line-clamp-2
                      text-[12px]
                      leading-5
                      text-topbar-subtle
                      "
                    >
                      {item.description}
                    </p>



                    <p
                      className="
                      mt-1
                      text-[11px]
                      text-topbar-muted
                      "
                    >
                      {item.time}
                    </p>



                  </article>

                ),

              )


            ) : (


              <p
                className="
                py-5
                text-center
                text-[12px]
                text-topbar-subtle
                "
              >

                {t.common.noData}

              </p>


            )}



          </div>



        </div>

      )}



    </div>

  );
}