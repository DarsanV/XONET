"use client";

import {
  Calendar,
  DollarSign,
  MessageSquare,
  Eye,
  MapPin,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PaymentStatusBadge, TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { formatRelativeTime } from "@/lib/task-store";
import type { Freelancer, Task } from "@/lib/types";
import { cn } from "@/lib/utils";

type AssignedTaskCardProps = {
  task: Task;
  freelancer: Freelancer;
  onView: () => void;
  onOpenChat: () => void;
};

export function AssignedTaskCard({
  task,
  freelancer,
  onView,
  onOpenChat,
}: AssignedTaskCardProps) {
  const activityLabel = task.lastActivity
    ? task.lastActivity
    : "Collaboration started";
  const activityTime = task.lastActivityAt
    ? formatRelativeTime(task.lastActivityAt)
    : "Recently";

  return (
    <Card
      className={cn(
        "group border-border bg-card p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]",
        "transition-all duration-300 hover:border-foreground/15 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Assigned project
          </p>
          <h3 className="mt-1 text-base font-semibold leading-snug">{task.title}</h3>
        </div>
        <TaskStatusBadge status={task.status} />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-md border border-border bg-background/50 p-3">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarFallback className="bg-secondary text-xs font-medium">
            {freelancer.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{freelancer.name}</p>
          <p className="truncate text-xs text-muted-foreground">{freelancer.headline}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {freelancer.location} · {freelancer.rate}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium tabular-nums">{task.progress}%</span>
        </div>
        <Progress value={task.progress} className="h-1.5 bg-secondary transition-all duration-500" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-md border border-border bg-background/40 px-3 py-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Deadline</p>
            <p className="text-xs font-medium">{task.deadline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-background/40 px-3 py-2">
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment</p>
            <div className="mt-0.5">
              <PaymentStatusBadge status={task.paymentStatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-md border border-border/80 bg-secondary/30 px-3 py-2.5">
        <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Latest activity
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-foreground/90">{activityLabel}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{activityTime}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-9 flex-1 gap-1.5 rounded-md transition-colors duration-200"
          onClick={onOpenChat}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Open Chat
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-9 flex-1 gap-1.5 rounded-md transition-colors duration-200"
          onClick={onView}
        >
          <Eye className="h-3.5 w-3.5" />
          Details
        </Button>
      </div>
    </Card>
  );
}
