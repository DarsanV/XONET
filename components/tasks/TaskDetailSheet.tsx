"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TaskStatusBadge, PaymentStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { SkillTags } from "@/components/tasks/SkillTags";
import { TaskApplicationsPanel } from "@/components/tasks/TaskApplicationsPanel";
import { useTaskStore } from "@/lib/task-store";
import type { Task } from "@/lib/types";
import { UserCheck } from "lucide-react";

type TaskDetailSheetProps = {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TaskDetailSheet({ task, open, onOpenChange }: TaskDetailSheetProps) {
  const { getFreelancer, getApplicationsForTask } = useTaskStore();

  if (!task) return null;

  const freelancer = task.assignedFreelancerId
    ? getFreelancer(task.assignedFreelancerId)
    : undefined;
  const applicationCount = getApplicationsForTask(task.id).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-border bg-card sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-left text-lg">{task.title}</SheetTitle>
          <SheetDescription className="text-left">
            {task.category} · {task.experienceLevel} · Due {task.deadline}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <TaskStatusBadge status={task.status} />
            <PaymentStatusBadge status={task.paymentStatus} />
            <span className="rounded-sm border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              {task.match}% match
            </span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Description</p>
            <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Skills</p>
            <div className="mt-2">
              <SkillTags skills={task.skills} max={12} />
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
                {freelancer ? (
                  <>
                    <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    {freelancer.name}
                  </>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">
              Applications ({applicationCount})
            </p>
            <TaskApplicationsPanel taskId={task.id} showTaskColumn={false} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
