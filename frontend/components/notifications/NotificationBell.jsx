"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/lib/notification-provider";
import { NotificationIcon } from "@/lib/notifications";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

function NotificationItem({ notification, onNavigate, compact = false }) {
    const { markRead, remove } = useNotifications();

    async function handleClick() {
        if (!notification.read) {
            await markRead(notification.id);
        }
        onNavigate(notification.href);
    }

    return (
        <div
            className={cn(
                "group flex gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-secondary/40",
                !notification.read && "bg-secondary/20",
                compact && "p-2.5",
            )}
        >
            <button type="button" onClick={handleClick} className="flex min-w-0 flex-1 gap-3 text-left">
                <NotificationIcon type={notification.type} />
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm leading-snug", !notification.read && "font-medium")}>
                            {notification.title}
                        </p>
                        {!notification.read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-foreground" />
                        )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {notification.message}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <span>{formatRelativeTime(notification.createdAt)}</span>
                        {notification.taskTitle && (
                            <>
                                <span>·</span>
                                <span className="truncate">{notification.taskTitle}</span>
                            </>
                        )}
                    </div>
                </div>
            </button>
            <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {!notification.read && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => markRead(notification.id)}
                        title="Mark as read"
                    >
                        <CheckCheck className="h-3.5 w-3.5" />
                    </Button>
                )}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(notification.id)}
                    title="Delete"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}

export function NotificationBell() {
    const router = useRouter();
    const { notifications, unreadCount, loading, markAllRead } = useNotifications();
    const recent = notifications.slice(0, 8);

    function navigate(href) {
        router.push(href);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full border border-border bg-card hover:bg-secondary"
                    aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background animate-in zoom-in-50 duration-200">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] border-border bg-card p-0 shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold">Notifications</p>
                        <p className="text-xs text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllRead}>
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[360px]">
                    <div className="p-2">
                        {loading && recent.length === 0 ? (
                            <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
                        ) : recent.length === 0 ? (
                            <div className="py-12 text-center">
                                <Bell className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">No notifications yet</p>
                            </div>
                        ) : (
                            recent.map((n) => (
                                <NotificationItem key={n.id} notification={n} onNavigate={navigate} compact />
                            ))
                        )}
                    </div>
                </ScrollArea>
                <div className="border-t border-border p-2">
                    <Button asChild variant="secondary" className="h-9 w-full text-xs">
                        <Link href="/notifications">View all notifications</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
