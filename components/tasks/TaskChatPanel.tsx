"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTaskStore, formatRelativeTime } from "@/lib/task-store";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

type TaskChatPanelProps = {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TaskChatPanel({ task, open, onOpenChange }: TaskChatPanelProps) {
  const { getMessagesForTask, sendMessage, getFreelancer } = useTaskStore();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = task ? getMessagesForTask(task.id) : [];
  const freelancer = task?.assignedFreelancerId
    ? getFreelancer(task.assignedFreelancerId)
    : undefined;

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages.length]);

  function handleSend() {
    if (!task || !draft.trim()) return;
    sendMessage(task.id, "client", draft);
    setDraft("");
  }

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col border-border bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Task collaboration
          </SheetTitle>
          <SheetDescription className="line-clamp-1 text-left">
            {task.title}
            {freelancer ? ` · ${freelancer.name}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto px-6 py-4"
        >
          {messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Start the conversation with your freelancer.
            </p>
          ) : (
            messages.map((msg) => {
              const isClient = msg.sender === "client";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200",
                    isClient ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-secondary text-[10px] font-medium">
                      {isClient ? "CL" : freelancer?.name.slice(0, 2).toUpperCase() ?? "FL"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-md px-3 py-2 text-sm",
                      isClient
                        ? "bg-foreground text-background"
                        : "border border-border bg-background",
                    )}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        isClient ? "text-background/70" : "text-muted-foreground",
                      )}
                    >
                      {formatRelativeTime(msg.sentAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-border p-4">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message freelancer…"
              className="h-10 border-border bg-background"
            />
            <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
