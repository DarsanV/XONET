"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SkillTags } from "@/components/tasks/SkillTags";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { CURRENT_FREELANCER_ID } from "@/lib/dummy-data";
import { useTaskStore } from "@/lib/task-store";
import type { Task } from "@/lib/types";
import { toast } from "sonner";

type TaskCardProps = {
  task: Task;
  showApply?: boolean;
  showStatus?: boolean;
};

export function TaskCard({ task, showApply = true, showStatus = false }: TaskCardProps) {
  const { applyToTask, hasApplied } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const applied = hasApplied(task.id, CURRENT_FREELANCER_ID);
  const canApply = showApply && task.status === "Open" && !applied;

  function handleApply() {
    if (!coverLetter.trim()) {
      toast.error("Please add a short cover letter.");
      return;
    }
    const result = applyToTask(
      task.id,
      CURRENT_FREELANCER_ID,
      coverLetter.trim(),
      proposedRate.trim() || undefined,
    );
    if (result) {
      toast.success("Application submitted", {
        description: "The client will review your proposal shortly.",
      });
      setOpen(false);
      setCoverLetter("");
      setProposedRate("");
    } else {
      toast.error("You've already applied to this task.");
    }
  }

  return (
    <>
      <Card className="group flex flex-col border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] transition-colors hover:border-foreground/30">
        <CardContent className="flex h-full flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="rounded-sm bg-secondary text-[10px] tracking-wide"
              >
                {task.match}% match
              </Badge>
              {showStatus && <TaskStatusBadge status={task.status} />}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">Due {task.deadline}</span>
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            {task.category} · {task.experienceLevel}
          </p>
          <h3 className="mt-2 text-[15px] font-semibold leading-snug">{task.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
          <div className="mt-4">
            <SkillTags skills={task.skills} />
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Budget</p>
              <p className="text-sm font-semibold">{task.budget}</p>
            </div>
            {canApply && (
              <Button size="sm" className="h-9 rounded-md px-4" onClick={() => setOpen(true)}>
                Apply
              </Button>
            )}
            {applied && (
              <Badge variant="secondary" className="rounded-sm text-[10px]">
                Applied
              </Badge>
            )}
            {showStatus && task.status !== "Open" && !showApply && (
              <span className="text-xs text-muted-foreground">{task.status}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply to project</DialogTitle>
            <DialogDescription>{task.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Cover letter
              </Label>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Briefly explain why you're a strong fit…"
                className="min-h-[120px] resize-none border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Proposed rate (optional)
              </Label>
              <Input
                value={proposedRate}
                onChange={(e) => setProposedRate(e.target.value)}
                placeholder="e.g. $3,500 fixed"
                className="h-10 border-border bg-background text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Submit application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
