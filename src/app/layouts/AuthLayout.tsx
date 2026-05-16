import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F5F7FB]">

      {/* Left Section */}
      <div
        className="
          hidden lg:flex
          flex-col
          justify-between
          p-12
          bg-gradient-to-br
          from-[#5B4FC7]
          to-[#4A3FB5]
          text-white
        "
      >
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            School Management
            <br />
            Dashboard
          </h1>

          <p className="mt-5 text-lg text-white/80 leading-8">
            Manage students, attendance,
            finance, academics, and reports
            in one modern platform.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5">
            Smart Academic Management
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5">
            Attendance & Scheduling
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5">
            Reports & Financial Tracking
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center px-6 py-10 bg-white">
        <Outlet />
      </div>
    </div>
  );
}