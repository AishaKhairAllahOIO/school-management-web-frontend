export type MessageCategory =
  | "Teacher"
  | "Supervisor"
  | "Parent"
  | "Student"
  | "Staff"
  | "System";

export type MessageStatus = "Open" | "Pending" | "Resolved";

export type MessageThread = {
  id: string;
  subject: string;
  lastMessage: string;
  participants: string;
  category: MessageCategory;
  date: string;
  unreadCount: number;
  status: MessageStatus;
};
