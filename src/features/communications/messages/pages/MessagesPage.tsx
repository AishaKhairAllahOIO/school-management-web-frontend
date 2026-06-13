import { useMemo, useState, type FormEvent } from "react";
import { Mail, MessageCircle, Send, Users } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useMessages } from "../hooks/useMessages";
import type { MessageThread } from "../types/message.types";

const categories = [
  "all",
  "Teacher",
  "Supervisor",
  "Parent",
  "Student",
  "Staff",
  "System",
] as const;

export function MessagesPage() {
  const { data = [], isLoading, isError } = useMessages();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("All Staff");

  const filteredMessages = useMemo(() => {
    return data.filter((thread) => {
      const matchesSearch =
        thread.subject.toLowerCase().includes(search.toLowerCase()) ||
        thread.lastMessage.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || thread.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [data, search, category]);

  const unreadCount = filteredMessages.reduce(
    (sum, thread) => sum + thread.unreadCount,
    0
  );

  function handleComposeToggle() {
    setIsComposeOpen((state) => !state);
  }

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubject("");
    setMessage("");
    setRecipient("All Staff");
    setIsComposeOpen(false);
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-card p-12 text-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-destructive/10 p-12 text-center">
        <p className="text-destructive">Failed to load messages.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Internal Messaging</h1>
          <p className="text-muted-foreground">
            Send direct or group messages across teachers, supervisors, parents, students, and staff.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="rounded-2xl" size="lg" onClick={handleComposeToggle}>
            <Send size={18} />
            {isComposeOpen ? "Hide Compose" : "New Message"}
          </Button>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <MessageCircle size={18} />
            {unreadCount} unread messages
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.78fr_0.22fr]">
        <section className="space-y-6">
          {isComposeOpen ? (
            <form
              onSubmit={handleSendMessage}
              className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Recipient</label>
                  <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Staff">All Staff</SelectItem>
                      <SelectItem value="Teachers">Teachers</SelectItem>
                      <SelectItem value="Supervisors">Supervisors</SelectItem>
                      <SelectItem value="Parents">Parents</SelectItem>
                      <SelectItem value="Students">Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Subject</label>
                  <Input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Message subject"
                    className="h-11 rounded-2xl"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm font-semibold text-foreground">Message</label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-3xl border border-border/70 bg-background p-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Write your message here..."
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={handleComposeToggle}>
                  Cancel
                </Button>
                <Button type="submit" className="rounded-2xl" size="lg">
                  Send Message
                </Button>
              </div>
            </form>
          ) : null}

          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-background p-5">
                <p className="text-sm text-muted-foreground">Total threads</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{filteredMessages.length}</p>
              </div>
              <div className="rounded-3xl bg-background p-5">
                <p className="text-sm text-muted-foreground">Unread messages</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{unreadCount}</p>
              </div>
              <div className="rounded-3xl bg-background p-5">
                <p className="text-sm text-muted-foreground">Open conversations</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {filteredMessages.filter((item) => item.status === "Open").length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="h-11 rounded-2xl"
              />
              <Select value={category} onValueChange={setCategory} >
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Filter category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "all" ? "All Categories" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.75fr] gap-4 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span>Conversation</span>
              <span>Participants</span>
              <span>Category</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            <div className="divide-y divide-border/70">
              {filteredMessages.map((thread: MessageThread) => (
                <div key={thread.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.75fr] gap-4 px-6 py-5 items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{thread.subject}</span>
                      {thread.unreadCount > 0 ? (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold uppercase text-primary">
                          {thread.unreadCount} new
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{thread.lastMessage}</p>
                  </div>
                  <p className="text-sm text-foreground">{thread.participants}</p>
                  <p className="text-sm text-muted-foreground">{thread.category}</p>
                  <p className="text-sm font-medium text-foreground">{thread.status}</p>
                  <p className="text-sm text-muted-foreground">{thread.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Users size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Audience segments</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Target groups, quick filters, and recent messaging activity.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-background p-4">
                <p className="text-sm text-muted-foreground">Teachers</p>
                <p className="mt-1 text-lg font-semibold text-foreground">12 active threads</p>
              </div>
              <div className="rounded-3xl bg-background p-4">
                <p className="text-sm text-muted-foreground">Parents</p>
                <p className="mt-1 text-lg font-semibold text-foreground">9 messages</p>
              </div>
              <div className="rounded-3xl bg-background p-4">
                <p className="text-sm text-muted-foreground">Supervisors</p>
                <p className="mt-1 text-lg font-semibold text-foreground">7 open discussions</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
                <Mail size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Communication health</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Keep response times low and escalation paths visible.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-3xl bg-background p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Average response time</p>
                <p className="mt-2 text-lg font-semibold text-foreground">1.4 hours</p>
              </div>
              <div className="rounded-3xl bg-background p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Escalations</p>
                <p className="mt-2 text-lg font-semibold text-foreground">3 active</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
