import type { MessageThread } from "../types/message.types";

export const messagesMock: MessageThread[] = [
  {
    id: "msg-01",
    subject: "Monthly fee update",
    lastMessage: "Please confirm the revised installment schedule.",
    participants: "Director, Finance Supervisor",
    category: "Supervisor",
    date: "May 20, 2026",
    unreadCount: 2,
    status: "Open",
  },
  {
    id: "msg-02",
    subject: "Student behavior alert",
    lastMessage: "The supervisor reviewed the incident and requested a meeting.",
    participants: "Teacher, Supervisor, Director",
    category: "Teacher",
    date: "May 18, 2026",
    unreadCount: 0,
    status: "Pending",
  },
  {
    id: "msg-03",
    subject: "Parent complaint escalation",
    lastMessage: "Need your approval before escalation to the counselor.",
    participants: "Parent, Director",
    category: "Parent",
    date: "May 15, 2026",
    unreadCount: 1,
    status: "Open",
  },
  {
    id: "msg-04",
    subject: "Staff leave approval",
    lastMessage: "Please confirm the leave request for next week.",
    participants: "Service Staff, Director",
    category: "Staff",
    date: "May 14, 2026",
    unreadCount: 0,
    status: "Resolved",
  },
];
