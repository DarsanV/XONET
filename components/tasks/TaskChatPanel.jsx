"use client";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTaskStore, formatRelativeTime, CURRENT_FREELANCER_ID } from "@/lib/task-store";
import { cn } from "@/lib/utils";
export function TaskChatPanel({ task, open, onOpenChange, currentRole = "client" }) {
    const { getMessagesForTask, sendMessage, getFreelancer, getWorkForTask } = useTaskStore();
    const [draft, setDraft] = useState("");
    const scrollRef = useRef(null);
    const messages = task ? getMessagesForTask(task.id) : [];
    const freelancer = task?.assignedFreelancerId
        ? getFreelancer(task.assignedFreelancerId)
        : undefined;
    const work = task ? getWorkForTask(task.id) : undefined;
    const isFreelancerView = currentRole === "freelancer";
    useEffect(() => {
        if (open && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [open, messages.length]);
    function handleSend() {
        if (!task || !draft.trim())
            return;
        sendMessage(task.id, isFreelancerView ? "freelancer" : "client", draft);
        setDraft("");
    }

    function handleShareProgress() {
        if (!work)
            return;
        const progressText = `Progress update: ${work.progress}% complete`;
        sendMessage(task.id, isFreelancerView ? "freelancer" : "client", progressText, "progress");
    }
    if (!task)
        return null;
    return (<Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col border-border bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-muted-foreground"/>
            Task collaboration
          </SheetTitle>
          <SheetDescription className="line-clamp-1 text-left">
            {task.title}
            {freelancer ? ` · ${freelancer.name}` : ""}
          </SheetDescription>
        </SheetHeader>

        {work && (<div className="border-b border-border bg-secondary/30 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground"/>
                <span className="text-xs font-medium">Progress</span>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {work.progress}%
              </Badge>
            </div>
            <Progress value={work.progress} className="mt-2 h-1.5 bg-secondary"/>
          </div>)}

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {messages.length === 0 ? (<p className="py-8 text-center text-sm text-muted-foreground">
              {isFreelancerView ? "Start the conversation with your client." : "Start the conversation with your freelancer."}
            </p>) : (messages.map((msg) => {
            const isClient = msg.sender === "client";
            const isOwnMessage = isFreelancerView ? !isClient : isClient;
            const isProgressUpdate = msg.type === "progress";

            if (isProgressUpdate) {
                return (<div key={msg.id} className="flex justify-center animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-[10px]">
                      <TrendingUp className="h-2.5 w-2.5 text-muted-foreground"/>
                      <span className="text-muted-foreground">{msg.text}</span>
                      <span className="text-[9px] text-muted-foreground">
                        {formatRelativeTime(msg.sentAt)}
                      </span>
                    </div>
                  </div>);
            }

            return (<div key={msg.id} className={cn("flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200", isOwnMessage ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-secondary text-[10px] font-medium">
                      {isClient ? "CL" : freelancer?.name.slice(0, 2).toUpperCase() ?? "FL"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("max-w-[80%] rounded-md px-3 py-2 text-sm", isOwnMessage
                    ? "bg-foreground text-background"
                    : "border border-border bg-background")}>
                    <p>{msg.text}</p>
                    <p className={cn("mt-1 text-[10px]", isOwnMessage ? "text-background/70" : "text-muted-foreground")}>
                      {formatRelativeTime(msg.sentAt)}
                    </p>
                  </div>
                </div>);
        }))}
        </div>

        <div className="border-t border-border p-4">
          {isFreelancerView && (<div className="mb-3">
            <Button type="button" variant="outline" size="sm" className="h-7 w-full text-[10px]" onClick={handleShareProgress}>
              <TrendingUp className="mr-1.5 h-3 w-3"/>
              Share Progress
            </Button>
          </div>)}
          <form className="flex gap-2" onSubmit={(e) => {
            e.preventDefault();
            handleSend();
        }}>
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={isFreelancerView ? "Message client…" : "Message freelancer…"} className="h-10 border-border bg-background"/>
            <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
              <Send className="h-4 w-4"/>
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>);
}
