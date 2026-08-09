// src/features/onboarding/onboardingSteps.ts
import { 
  LayoutDashboard, Users, GraduationCap, ClipboardCheck, CalendarDays, 
  Wallet, MessageCircle, BarChart3, Settings, Globe, Bell, UserCircle 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface OnboardingStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: LucideIcon;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  // --- Sidebar (10 Steps) ---
  {
    target: '#sidebar-dashboard',
    title: 'Dashboard',
    content: 'Get a complete overview of your school metrics at a glance.',
    placement: 'right',
    icon: LayoutDashboard,
  },
  {
    target: '#sidebar-users',
    title: 'User Management',
    content: 'Easily manage students, teachers, and staff profiles.',
    placement: 'right',
    icon: Users,
  },
  {
    target: '#sidebar-academics',
    title: 'Academics',
    content: 'Manage grades, classes, subjects, and teaching assignments.',
    placement: 'right',
    icon: GraduationCap,
  },
  {
    target: '#sidebar-attendance',
    title: 'Attendance',
    content: 'Track daily attendance for students and staff with real-time updates.',
    placement: 'right',
    icon: ClipboardCheck,
  },
  {
    target: '#sidebar-scheduling',
    title: 'Scheduling',
    content: 'Organize timetables, class schedules, and exam dates.',
    placement: 'right',
    icon: CalendarDays,
  },
  {
    target: '#sidebar-finance',
    title: 'Finance',
    content: 'Track payments, manage fees, handle invoices, and view reports.',
    placement: 'right',
    icon: Wallet,
  },
  {
    target: '#sidebar-communications',
    title: 'Communications',
    content: 'Send announcements, alerts, and share school policies.',
    placement: 'right',
    icon: MessageCircle,
  },
  {
    target: '#sidebar-reports',
    title: 'Reports & Analytics',
    content: 'Access detailed data insights, trends, and performance analytics.',
    placement: 'right',
    icon: BarChart3,
  },
  {
    target: '#sidebar-settings',
    title: 'Settings',
    content: 'Configure system preferences, manage permissions, and global options.',
    placement: 'right',
    icon: Settings,
  },
  {
    target: '#sidebar-website',
    title: 'Manage Website',
    content: 'Manage public content and information for your school website.',
    placement: 'top', // ✅ تم تغييره من right إلى top
    icon: Globe,
  },
  // --- Topbar Items ---
  {
    target: '#topbar-notifications',
    title: 'Notifications',
    content: 'Stay updated with real-time alerts, reminders, and important messages.',
    placement: 'top', // ✅ تم تغييره من bottom إلى top
    icon: Bell,
  },
  {
    target: '#topbar-profile',
    title: 'Your Profile',
    content: 'View and manage your account details, and restart this tour anytime.',
    placement: 'top', // ✅ تم تغييره من bottom إلى top
    icon: UserCircle,
  },
];