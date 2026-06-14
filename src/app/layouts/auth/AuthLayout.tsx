import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        <div
          className="
            relative
            hidden
            overflow-hidden
            bg-gradient-to-br
            sidebar-gradient
            lg:flex
            lg:flex-col
            lg:justify-center
            px-20
            py-20
            text-primary-foreground
          "
        >

          <motion.div
            animate={{
              y: [0, -40, 0],
              x: [0, 40, 0],
              scale: [2, 3, 2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              left-[-80px]
              top-[-80px]
              h-[240px]
              w-[240px]
              rounded-full
              bg-card/10
            "
          />

          <motion.div
            animate={{
              y: [0, 40, 0],
              x: [0, -30, 0],
              scale: [0.5, 2, 0.5],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              bottom-[-60px]
              right-[20px]
              h-[180px]
              w-[180px]
              rounded-full
              bg-card/10
            "
          />

          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              bottom-[-60px]
              left-[20px]
              h-[180px]
              w-[180px]
              rounded-full
              bg-card/10
            "
          />

          <div className="relative z-10 mb-10 flex items-center gap-4">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-card
                text-2xl
                font-bold
                text-sidebar-active
                shadow-soft
              "
            >
              S
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                School Desk
              </h1>

              <p className="mt-1 text-sm text-primary-foreground/70">
                School Management Dashboard
              </p>
            </div>
          </div>

          <motion.h2
            animate={{
              textShadow: [
                "0px 0px 0px rgba(255,255,255,0.3)",
                "0px 0px 12px rgba(255,255,255,0.5)",
                "0px 0px 0px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              relative
              z-10
              text-5xl
              font-bold
              leading-tight
            "
          >
            Manage Your School Easily.
          </motion.h2>

          <p
            className="
              relative
              z-10
              mt-6
              text-lg
              leading-8
              text-primary-foreground/80
            "
          >
            Modern dashboard for managing students,
            academics, attendance, schedules, and finance.
          </p>

          <div
            className="
              absolute
              right-[-120px]
              top-0
              h-full
              w-[200px]
              rounded-[30px]
              bg-background
            "
          />
        </div>

        <div
          className="
            relative
            flex
            items-center
            justify-center
            px-6
            py-16
            lg:px-16
          "
        >

          <div
            className="
              absolute
              inset-0
              bg-card/30
              backdrop-blur-[2px]
            "
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              relative
              z-10
              mt-10
              w-full
              max-w-md
            "
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}