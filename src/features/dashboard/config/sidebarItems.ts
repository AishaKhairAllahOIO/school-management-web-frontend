import {BarChart3,Bell,CalendarCheck,CalendarDays,GraduationCap,LayoutDashboard,Settings,Users,Wallet,} from "lucide-react";
import type { SidebarItem } from "../types/layout.types";

export const sidebarItems: SidebarItem[] =
[
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },

  {
    title: "Users",
    icon: Users,
    children: 
    [
      { title: "Students", path: "/users/students" },
      { title: "Teachers", path: "/users/teachers" },
      { title: "Parents", path: "/users/parents" },
      { title: "Advisors", path: "/users/advisors" },
      { title: "Staff", path: "/users/staff" },
    ],
  },
  {
    title: "Academic Management",
    icon: GraduationCap,
    children: 
    [
      { title: "Classes", path: "/academics/classes" },
      { title: "Sections", path: "/academics/sections" },
      { title: "Subjects", path: "/academics/subjects" },
      { title: "Exams", path: "/academics/exams" },
      { title: "Grades", path: "/academics/grades" },
      { title: "Promotions", path: "/academics/promotions" },
    ],
  },
  {
    title: "Attendance",
    icon: CalendarCheck,
    children: 
    [
      { title: "Students Attendance", path: "/attendance/students" },
      { title: "Staff Attendance", path: "/attendance/staff" },
    ],
  },
  {
    title: "Scheduling",
    icon: CalendarDays,
    children: 
    [
      { title: "Class Schedules", path: "/scheduling/classes" },
      { title: "Teacher Schedules", path: "/scheduling/teachers" },
      { title: "Exam Schedules", path: "/scheduling/exams" },
      { title: "Holidays", path: "/scheduling/holidays" },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    children: 
    [
      { title: "Fees", path: "/finance/fees" },
      { title: "Payments", path: "/finance/payments" },
      { title: "Installments", path: "/finance/installments" },
      { title: "Salaries", path: "/finance/salaries" },
      { title: "Deductions", path: "/finance/deductions" },
    ],
  },
  {
    title: "Communication",
    icon: Bell,
    children: 
    [
      { title: "Announcements", path: "/communications/announcements" },
      { title: "Notifications", path: "/communications/notifications" },
      { title: "Complaints", path: "/communications/complaints" },
      { title: "Activities", path: "/communications/activities" },
    ],
  },
  {
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    icon: Settings,
    children: 
    [
      { title: "Roles", path: "/settings/roles" },
      { title: "Permissions", path: "/settings/permissions" },
      { title: "School Config", path: "/settings/school-config" },
      { title: "System Config", path: "/settings/system-config" },
    ],
  },
];