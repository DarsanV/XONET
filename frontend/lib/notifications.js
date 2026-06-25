import {
    Bell,
    Briefcase,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    RefreshCw,
    UserCircle,
    UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NOTIFICATION_META = {
    application_received: {
        icon: UserPlus,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    task_assigned: {
        icon: Briefcase,
        color: "text-violet-400",
        bg: "bg-violet-400/10",
    },
    task_status_changed: {
        icon: RefreshCw,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
    },
    progress_updated: {
        icon: ClipboardList,
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
    },
    payment_status_changed: {
        icon: CreditCard,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
    },
    deadline_approaching: {
        icon: CalendarClock,
        color: "text-orange-400",
        bg: "bg-orange-400/10",
    },
    task_completed: {
        icon: CheckCircle2,
        color: "text-green-400",
        bg: "bg-green-400/10",
    },
    profile_updated: {
        icon: UserCircle,
        color: "text-zinc-300",
        bg: "bg-zinc-400/10",
    },
};

export function getNotificationMeta(type) {
    return NOTIFICATION_META[type] ?? {
        icon: Bell,
        color: "text-muted-foreground",
        bg: "bg-secondary",
    };
}

export function NotificationIcon({ type, className }) {
    const meta = getNotificationMeta(type);
    const Icon = meta.icon;
    return (
        <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md", meta.bg, className)}>
            <Icon className={cn("h-4 w-4", meta.color)} strokeWidth={1.75} />
        </div>
    );
}
