import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, GraduationCap } from "lucide-react";

import sidebarPattern from "@/assets/images/sidebar.png";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F5FF] text-foreground">
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[46%_54%]">
        <aside className="relative hidden min-h-screen overflow-hidden bg-[#171044] text-white lg:block">
          <div className="absolute inset-0 sidebar-gradient" />

          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-screen"
            style={{
              backgroundImage: `url(${sidebarPattern})`,
              backgroundSize: "520px",
              backgroundRepeat: "repeat",
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(139,92,246,0.24),transparent_24rem)]" />
          <div className="absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-12 text-center"
          >
            <div className="mb-8 flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] primary-gradient shadow-[0_20px_45px_rgba(103,58,244,0.34)]">
                <GraduationCap className="h-11 w-11 text-white" />
              </div>
            </div>

            <h1 className="max-w-sm text-4xl font-black leading-tight tracking-tight xl:text-5xl">
              School
              <br />
              Management
              <br />
              System
            </h1>

            <p className="mt-6 max-w-xs text-sm font-medium leading-7 text-white/68">
              Secure access for academic, financial, attendance and staff
              operations.
            </p>

            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-5 py-3 text-sm font-extrabold text-white/82 backdrop-blur-xl">
              <BookOpenCheck className="h-5 w-5 text-violet-200" />
              Built for modern schools
            </div>
          </motion.div>
        </aside>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8">
          <div
            className="absolute inset-0 opacity-[0.035] lg:hidden"
            style={{
              backgroundImage: `url(${sidebarPattern})`,
              backgroundSize: "520px",
              backgroundRepeat: "repeat",
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_28rem)]" />
          <div className="absolute bottom-[-13rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[470px]"
          >
            {children}
          </motion.div>
        </section>
      </section>
    </main>
  );
}