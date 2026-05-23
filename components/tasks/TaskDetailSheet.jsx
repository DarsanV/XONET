"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TaskStatusBadge, PaymentStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { SkillTags } from "@/components/tasks/SkillTags";
import { TaskApplicationsPanel } from "@/components/tasks/TaskApplicationsPanel";
import { useTaskStore, formatRelativeTime } from "@/lib/task-store";
import { Activity, MessageSquare, UserCheck } from "lucide-react";
export function TaskDetailSheet({ task, open, onOpenChange, onOpenChat, }) {
    const { getFreelancer, getApplicationsForTask } = useTaskStore();
    if (!task)
        return null;
    const freelancer = task.assignedFreelancerId
        ? getFreelancer(task.assignedFreelancerId)
        : undefined;
    const applicationCount = getApplicationsForTask(task.id).length;
    return (<Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-border bg-card sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-left text-lg">{task.title}</SheetTitle>
          <SheetDescription className="text-left">
            {task.category} · {task.experienceLevel} · Due {task.deadline}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <TaskStatusBadge status={task.status}/>
            <PaymentStatusBadge status={task.paymentStatus}/>
            <span className="rounded-sm border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              {task.match}% match
            </span>
          </div>

          {task.assignedFreelancerId && (<div className="space-y-3 rounded-md border border-border bg-background/50 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Collaboration progress
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium tabular-nums">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-1.5 bg-secondary"/>
              {task.lastActivity && (<div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"/>
                  <div>
                    <p>{task.lastActivity}</p>
                    {task.lastActivityAt && (<p className="mt-0.5">{formatRelativeTime(task.lastActivityAt)}</p>)}
                  </div>
                </div>)}
              {onOpenChat && (<Button type="button" className="h-9 w-full gap-2 rounded-md" onClick={() => onOpenChat(task)}>
                  <MessageSquare className="h-4 w-4"/>
                  Open Chat
                </Button>)}
            </div>)}

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Description</p>
            <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Skills</p>
            <div className="mt-2">
              <SkillTags skills={task.skills} max={12}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Budget</p>
              <p className="mt-1 text-sm font-semibold">{task.budget}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Assigned</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm">
                {freelancer ? (<>
                    <UserCheck className="h-3.5 w-3.5 text-muted-foreground"/>
                    {freelancer.name}
                  </>) : (<span className="text-muted-foreground">Unassigned</span>)}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">
              Applications ({applicationCount})
            </p>
            <TaskApplicationsPanel taskId={task.id} showTaskColumn={false}/>
          </div>
        </div>
      </SheetContent>
    </Sheet>);
}
