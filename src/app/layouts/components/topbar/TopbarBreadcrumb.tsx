import { useLocale } from "@/app/providers/locale";

import {
  getCurrentPageTitle,
  getSectionKey,
} from "./topbar.helpers";


type TopbarBreadcrumbProps = {
  pathname: string;
};


export function TopbarBreadcrumb({
  pathname,
}: TopbarBreadcrumbProps) {


  const { t } = useLocale();



  const sectionKey =
    getSectionKey(pathname);



  const sectionTitle =
    t.navigation[sectionKey];



  const currentPageTitle =
    getCurrentPageTitle(
      pathname,
      t.layout.topbar.overview,
    );



  const isSameTitle =
    sectionTitle.trim().toLowerCase() ===
    currentPageTitle.trim().toLowerCase();




  return (

    <nav
      aria-label="Breadcrumb"
      className="
      hidden
      min-w-0
      items-center
      lg:flex
      "
    >

      <ol
        className="
        flex
        items-center
        gap-3
        text-[15px]
        tracking-[-0.015em]
        "
      >


        <li className="max-w-[180px] truncate">

          <span
            className="
            font-semibold
            text-topbar-title
            "
          >
            {sectionTitle}
          </span>

        </li>



        {!isSameTitle ? (

          <>


            <li
              aria-hidden="true"
              className="
              text-topbar-muted/40
              "
            >
              /
            </li>



            <li
              className="
              max-w-[180px]
              truncate
              "
            >

              <span
                className="
                font-medium
                text-topbar-muted
                "
              >

                {currentPageTitle}

              </span>

            </li>


          </>

        ) : null}


      </ol>


    </nav>

  );
}