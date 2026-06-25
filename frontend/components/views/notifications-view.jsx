"use client";

import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/tasks/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/lib/notification-provider";
import { NotificationIcon } from "@/lib/notifications";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

export function NotificationsView() {
    const router = useRouter();
    const { notifications, unreadCount, loading, markRead, markAllRead, remove } = useNotifications();

    async function handleOpen(notification) {
        if (!notification.read) {
            await markRead(notification.id);
        }
        router.push(notification.href);
    }

    return (
        <div className="space-y-8">
            <PageHeader
                eyebrow="Inbox"
                title="Notifications"
                description="Stay updated on applications, assignments, progress, payments, and deadlines."
                action={unreadCount > 0 ? (
                    <Button variant="secondary" className="h-10 gap-2" onClick={markAllRead}>
                        <CheckCheck className="h-4 w-4" />
                        Mark all read
                    </Button>
                ) : undefined}
            />

            {loading && notifications.length === 0 ? (
                <Card className="border-border bg-card py-16 text-center text-sm text-muted-foreground">
                    Loading notifications…
                </Card>
            ) : notifications.length === 0 ? (
                <Card className="border-border bg-card py-16 text-center">
                    <Bell className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No notifications yet. Activity will appear here.</p>
                </Card>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={cn(
                                "border-border bg-card transition-colors hover:border-foreground/20",
                                !notification.read && "ring-1 ring-foreground/10",
                            )}
                        >
                            <div className="flex items-start gap-4 p-4">
                                <button type="button" onClick={() => handleOpen(notification)} className="flex min-w-0 flex-1 gap-4 text-left">
                                    <NotificationIcon type={notification.type} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className={cn("text-sm", !notification.read && "font-semibold")}>
                                                {notification.title}
                                            </p>
                                            {!notification.read && (
                                                <span className="h-2 w-2 rounded-full bg-foreground" />
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span>{formatRelativeTime(notification.createdAt)}</span>
                                            {notification.taskTitle && (
                                                <>
                                                    <span>·</span>
                                                    <span>{notification.taskTitle}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </button>
                                <div className="flex shrink-0 gap-1">
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => markRead(notification.id)}
                                            title="Mark as read"
                                        >
                                            <CheckCheck className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => remove(notification.id)}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
