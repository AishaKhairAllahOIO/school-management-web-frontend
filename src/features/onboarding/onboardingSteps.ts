// src/features/onboarding/onboardingSteps.ts
import type { Step } from 'react-joyride';

export const ONBOARDING_STEPS: Step[] = [
  // --- Sidebar Items (10 Steps) ---
  {
    target: '#sidebar-dashboard',
    title: 'Dashboard',
    content: 'Get a quick overview of your entire school system at a glance.',
    placement: 'right',
   // disableBeacon: true,
  },
  {
    target: '#sidebar-users',
    title: 'Users Management',
    content: 'Create and manage admins, teachers, students, and staff profiles.',
    placement: 'right',
  //  disableBeacon: true,
  },
  {
    target: '#sidebar-academics',
    title: 'Academics',
    content: 'Manage courses, curriculum, class schedules, and grading systems.',
    placement: 'right',
  //  disableBeacon: true,
  },
  {
    target: '#sidebar-attendance',
    title: 'Attendance',
    content: 'Track daily attendance for both students and staff efficiently.',
    placement: 'right',
   // disableBeacon: true,
  },
  {
    target: '#sidebar-scheduling',
    title: 'Scheduling',
    content: 'Organize school timetables and manage upcoming events.',
    placement: 'right',
   // disableBeacon: true,
  },
  {
    target: '#sidebar-finance',
    title: 'Finance',
    content: 'Track payments, fees, invoices, and manage financial reports.',
    placement: 'right',
  //  disableBeacon: true,
  },
  {
    target: '#sidebar-communications',
    title: 'Communications',
    content: 'Send announcements, emails, and SMS to parents and staff.',
    placement: 'right',
  //  disableBeacon: true,
  },
  {
    target: '#sidebar-reports',
    title: 'Reports & Analytics',
    content: 'Access detailed data insights and performance analytics.',
    placement: 'right',
  //  disableBeacon: true,
  },
  {
    target: '#sidebar-settings',
    title: 'Settings',
    content: 'Configure system preferences, permissions, and global options.',
    placement: 'right',
  //  disableBeacon: true,
  },
  {
    target: '#sidebar-website',
    title: 'View Website',
    content: 'Quickly preview your public-facing school website from here.',
    placement: 'right',
   // disableBeacon: true,
  },
  // --- Topbar Items (2 Steps) ---
  {
    target: '#topbar-notifications',
    title: 'Notifications',
    content: 'Stay updated with real-time alerts and important system messages.',
    placement: 'bottom',
  //  disableBeacon: true,
  },
  {
    target: '#topbar-profile',
    title: 'Your Profile',
    content: 'Manage your account details, roles, and start the tour again here.',
    placement: 'bottom',
  //  disableBeacon: true,
  },
];