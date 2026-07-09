import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

import sidebarPattern from "@/assets/images/sidebar.png";
import { AuthBrandLogo } from "./AuthBrandLogo";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  const [isSwapped, setIsSwapped] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative min-h-screen overflow-hidden p-0 lg:p-5">
        <div className="relative grid min-h-screen overflow-hidden bg-[#F8F7FF] lg:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2 lg:rounded-[2.25rem] lg:border lg:border-border/70 lg:bg-card lg:shadow-[0_18px_50px_rgba(31,25,78,0.08)]">
          <motion.aside
            animate={{
              x: isSwapped ? "100%" : "0%",
              borderRadius: isSwapped
                ? "2.25rem 0 0 2.25rem"
                : "0 2.25rem 2.25rem 0",
            }}
            transition={{
              type: "spring",
              stiffness: 95,
              damping: 22,
              mass: 0.9,
            }}
            className="relative z-20 hidden min-h-full overflow-hidden bg-sidebar text-sidebar-foreground lg:block"
          >
            <div className="absolute inset-0 sidebar-gradient" />

            <div
              className="absolute inset-0 opacity-[0.105] mix-blend-screen"
              style={{
                backgroundImage: `url(${sidebarPattern})`,
                backgroundSize: "520px",
                backgroundRepeat: "repeat",
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_22%,rgba(139,92,246,0.16),transparent_25rem)]" />
            <div className="absolute bottom-[-12rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-10 text-center">
              <motion.div
                animate={{ rotate: isSwapped ? 4 : 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/12 bg-white/8 backdrop-blur-xl"
              >
                <AuthBrandLogo size="lg" variant="light" />
              </motion.div>

              <h1 className="max-w-sm text-4xl font-black leading-[1.08] tracking-tight xl:text-5xl">
                School
                <br />
                Management
                <br />
                <span className="text-violet-300">System</span>
              </h1>

              <p className="mt-6 max-w-xs text-sm font-medium leading-7 text-white/65">
                Secure access for academic, financial and administrative
                operations.
              </p>

              <button
                type="button"
                onClick={() => setIsSwapped((value) => !value)}
                className="group mt-10 inline-flex h-14 min-w-[190px] items-center justify-center gap-3 rounded-full border border-white/12 bg-white/10 px-7 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/15"
              >
                <ShieldCheck className="h-5 w-5 text-violet-200" />
                Sign In
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </div>
          </motion.aside>

          <motion.section
            animate={{ x: isSwapped ? "-100%" : "0%" }}
            transition={{
              type: "spring",
              stiffness: 95,
              damping: 22,
              mass: 0.9,
            }}
            className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 lg:min-h-full"
          >
            <div
              className="absolute inset-0 opacity-[0.035] lg:hidden"
              style={{
                backgroundImage: `url(${sidebarPattern})`,
                backgroundSize: "520px",
                backgroundRepeat: "repeat",
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.13),transparent_28rem)]" />
            <div className="absolute bottom-[-13rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-primary/8 blur-3xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={isSwapped ? "auth-form-left" : "auth-form-right"}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.985 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[460px]"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.section>
        </div>
      </section>
    </main>
  );
}