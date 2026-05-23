"use client";
import { useState, useMemo } from "react";
import { MessageSquare, Send, TrendingUp, MoreVertical, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskStore, formatRelativeTime, CURRENT_FREELANCER_ID } from "@/lib/task-store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ChatView() {
    const router = useRouter();
    const { getMyWorks, getMessagesForTask, sendMessage, getTask, getWorkForTask, getFreelancer, assignedTasks, updateWorkProgress } = useTaskStore();
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [draft, setDraft] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [messageTab, setMessageTab] = useState("all");

    // Get conversations for current user (freelancer or client)
    const conversations = useMemo(() => {
        const works = getMyWorks();
        return works.map((work) => {
            const task = getTask(work.taskId);
            const messages = getMessagesForTask(work.taskId);
            const lastMessage = messages[messages.length - 1];
            return {
                task,
                work,
                messages,
                lastMessage,
                lastActivity: lastMessage?.sentAt || work.lastUpdatedAt,
            };
        }).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    }, [getMyWorks, getTask, getMessagesForTask]);

    // Separate conversations by last message sender
    const clientConversations = useMemo(() => {
        return conversations.filter((conv) => conv.lastMessage?.sender === "client");
    }, [conversations]);

    const freelancerConversations = useMemo(() => {
        return conversations.filter((conv) => conv.lastMessage?.sender === "freelancer");
    }, [conversations]);

    const selectedConversation = selectedTaskId
        ? conversations.find((c) => c.task?.id === selectedTaskId)
        : conversations[0];

    const messages = selectedConversation?.messages || [];
    const task = selectedConversation?.task;
    const work = selectedConversation?.work;
    const freelancer = task?.assignedFreelancerId ? getFreelancer(task.assignedFreelancerId) : undefined;

    function handleSend() {
        if (!task || !draft.trim())
            return;
        sendMessage(task.id, "freelancer", draft);
        setDraft("");
    }

    function handleShareProgress() {
        if (!work)
            return;
        const progressText = `Progress update: ${work.progress}% complete`;
        sendMessage(task.id, "freelancer", progressText, "progress");
        toast.success("Progress shared in chat");
    }

    return (
        <div className="h-[calc(100vh-8rem)]">
            <header className="mb-6">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Messages</p>
                <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Conversations</h1>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    Chat with clients about your projects. Messages sync in real-time.
                </p>
            </header>

            <Card className="flex h-[calc(100vh-14rem)] overflow-hidden border-border bg-card">
                {/* Sidebar */}
                {sidebarOpen && (
                    <div className="w-80 border-r border-border bg-secondary/20">
                        <div className="border-b border-border p-4">
                            <h2 className="text-sm font-semibold">Active Projects</h2>
                            <p className="text-xs text-muted-foreground">{conversations.length} conversations</p>
                        </div>
                        <Tabs value={messageTab} onValueChange={setMessageTab} className="h-[calc(100%-57px)]">
                            <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border bg-transparent">
                                <TabsTrigger value="all" className="rounded-none text-xs data-[state=active]:border-b-2 data-[state=active]:border-foreground">
                                    All
                                </TabsTrigger>
                                <TabsTrigger value="client" className="rounded-none text-xs data-[state=active]:border-b-2 data-[state=active]:border-foreground">
                                    Clients
                                </TabsTrigger>
                                <TabsTrigger value="freelancer" className="rounded-none text-xs data-[state=active]:border-b-2 data-[state=active]:border-foreground">
                                    Freelancers
                                </TabsTrigger>
                            </TabsList>
                            <ScrollArea className="h-[calc(100%-41px)]">
                                <TabsContent value="all" className="m-0 p-0">
                                    {conversations.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No active conversations yet.
                                        </div>
                                    ) : (
                                        conversations.map((conv) => (
                                            <ConversationItem
                                                key={conv.task.id}
                                                conversation={conv}
                                                isSelected={selectedTaskId === conv.task.id}
                                                onSelect={() => setSelectedTaskId(conv.task.id)}
                                            />
                                        ))
                                    )}
                                </TabsContent>
                                <TabsContent value="client" className="m-0 p-0">
                                    {clientConversations.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No messages from clients yet.
                                        </div>
                                    ) : (
                                        clientConversations.map((conv) => (
                                            <ConversationItem
                                                key={conv.task.id}
                                                conversation={conv}
                                                isSelected={selectedTaskId === conv.task.id}
                                                onSelect={() => setSelectedTaskId(conv.task.id)}
                                            />
                                        ))
                                    )}
                                </TabsContent>
                                <TabsContent value="freelancer" className="m-0 p-0">
                                    {freelancerConversations.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No messages from freelancers yet.
                                        </div>
                                    ) : (
                                        freelancerConversations.map((conv) => (
                                            <ConversationItem
                                                key={conv.task.id}
                                                conversation={conv}
                                                isSelected={selectedTaskId === conv.task.id}
                                                onSelect={() => setSelectedTaskId(conv.task.id)}
                                            />
                                        ))
                                    )}
                                </TabsContent>
                            </ScrollArea>
                        </Tabs>
                    </div>
                )}

                {/* Main Chat Area */}
                <div className="flex flex-1 flex-col">
                    {task ? (
                        <>
                            {/* Chat Header */}
                            <div className="border-b border-border px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {!sidebarOpen && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => setSidebarOpen(true)}
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarFallback className="bg-secondary text-xs font-medium">
                                                CL
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">{task.title}</h3>
                                            <p className="text-xs text-muted-foreground">{work?.client}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8"
                                            onClick={() => setSidebarOpen(!sidebarOpen)}
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Progress Bar in Header */}
                                {work && (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-muted-foreground">Progress</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">
                                                {work.progress}%
                                            </Badge>
                                        </div>
                                        <Progress value={work.progress} className="mt-1.5 h-1.5 bg-secondary" />
                                    </div>
                                )}
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 px-6 py-4">
                                {messages.length === 0 ? (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-center">
                                            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                            <p className="mt-4 text-sm text-muted-foreground">
                                                Start the conversation with your client.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg) => {
                                            const isClient = msg.sender === "client";
                                            const isOwnMessage = !isClient;
                                            const isProgressUpdate = msg.type === "progress";

                                            if (isProgressUpdate) {
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className="flex justify-center animate-in fade-in slide-in-from-bottom-1 duration-200"
                                                    >
                                                        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-4 py-2 text-xs">
                                                            <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-muted-foreground">{msg.text}</span>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {formatRelativeTime(msg.sentAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={cn(
                                                        "flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-200",
                                                        isOwnMessage ? "flex-row-reverse" : "flex-row"
                                                    )}
                                                >
                                                    <Avatar className="h-8 w-8 border border-border">
                                                        <AvatarFallback className="bg-secondary text-[10px] font-medium">
                                                            {isClient ? "CL" : freelancer?.name.slice(0, 2).toUpperCase() ?? "FL"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div
                                                        className={cn(
                                                            "max-w-[70%] rounded-lg px-4 py-2.5 text-sm",
                                                            isOwnMessage
                                                                ? "bg-foreground text-background"
                                                                : "border border-border bg-background"
                                                        )}
                                                    >
                                                        <p>{msg.text}</p>
                                                        <p
                                                            className={cn(
                                                                "mt-1 text-[10px]",
                                                                isOwnMessage ? "text-background/70" : "text-muted-foreground"
                                                            )}
                                                        >
                                                            {formatRelativeTime(msg.sentAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="border-t border-border p-4">
                                <div className="mb-3 flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={handleShareProgress}
                                    >
                                        <TrendingUp className="mr-2 h-3 w-3" />
                                        Share Progress
                                    </Button>
                                </div>
                                <form
                                    className="flex gap-3"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSend();
                                    }}
                                >
                                    <Input
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        placeholder="Message client…"
                                        className="h-10 border-border bg-background"
                                    />
                                    <Button type="submit" size="icon" className="h-10 w-10 shrink-0">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-sm text-muted-foreground">
                                    {conversations.length === 0
                                        ? "No active conversations yet."
                                        : "Select a conversation to start chatting."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

function ConversationItem({ conversation, isSelected, onSelect }) {
    const { task, work, lastMessage, lastActivity } = conversation;

    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full border-l-2 p-4 text-left transition-colors hover:bg-secondary/30",
                isSelected ? "border-foreground bg-secondary/30" : "border-transparent"
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task?.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground truncate">{work?.client}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                    {work?.progress}%
                </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {lastMessage?.text || "No messages yet"}
                </p>
                <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatRelativeTime(lastActivity)}
                </span>
            </div>
        </button>
    );
}
