"use client";
import { useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTaskStore, formatRelativeTime } from "@/lib/task-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
function statusStyle(status) {
    switch (status) {
        case "Active":
            return "bg-foreground/10 text-foreground border border-foreground/20";
        case "Completed":
            return "bg-secondary text-muted-foreground border border-border";
        case "In Review":
            return "bg-accent/15 text-accent border border-accent/30";
    }
}
function WorkCard({ work }) {
    const { updateWorkProgress } = useTaskStore();
    async function handleProgressChange(values) {
        const next = values[0] ?? work.progress;
        try {
            await updateWorkProgress(work.id, next);
            toast.success("Progress synced", {
                description: "Client Tasks page updated in real time.",
            });
        }
        catch (err) {
            toast.error(err.message || "Could not update progress");
        }
    }
    return (<Card className={cn("border-border bg-card p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]", "transition-all duration-300 hover:border-foreground/15")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">{work.project}</p>
          <p className="text-sm text-muted-foreground">{work.client}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`rounded-sm px-2 py-0.5 text-[10px] font-medium ${statusStyle(work.status)}`}>
            {work.status}
          </Badge>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Your progress</span>
          <span className="font-medium tabular-nums">{work.progress}%</span>
        </div>
        <Progress value={work.progress} className="h-1.5 bg-secondary transition-all duration-500"/>
        <Slider value={[work.progress]} max={100} step={1} onValueCommit={handleProgressChange} className="py-1"/>
        <p className="text-[10px] text-muted-foreground">
          Drag to update — syncs to client task management automatically.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment</p>
          <p className="mt-0.5 font-semibold">{work.payment}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Deadline</p>
          <p className="mt-0.5 text-muted-foreground">{work.deadline}</p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground">
        Last updated {formatRelativeTime(work.lastUpdatedAt)}
      </p>

      <div className="mt-4 flex gap-2">
        {[25, 50, 75, 100].map((pct) => (<Button key={pct} type="button" variant="secondary" size="sm" className="h-8 flex-1 rounded-md text-xs" onClick={async () => {
                try {
                    await updateWorkProgress(work.id, pct);
                    toast.success(`Progress set to ${pct}%`);
                }
                catch (err) {
                    toast.error(err.message || "Could not update progress");
                }
            }}>
            {pct}%
          </Button>))}
      </div>
    </Card>);
}
export function MyWorksView() {
    const { getMyWorks, getTask } = useTaskStore();
    const works = getMyWorks();
    const { active, completed } = useMemo(() => ({
        active: works.filter((w) => w.status === "Active" || w.status === "In Review"),
        completed: works.filter((w) => w.status === "Completed"),
    }), [works]);
    return (<div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">My Works</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Your projects</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Update progress here — changes sync instantly to the client Tasks dashboard.
        </p>
      </header>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="bg-card">
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="all">All ({works.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <WorksGrid items={active} />
        </TabsContent>
        <TabsContent value="completed">
          <WorksGrid items={completed} />
        </TabsContent>
        <TabsContent value="all">
          <WorksGrid items={works} />
        </TabsContent>
      </Tabs>
    </div>);
}
function WorksGrid({ items }) {
    if (items.length === 0) {
        return (<Card className="border-border bg-card py-16 text-center text-sm text-muted-foreground">
        Nothing here yet. Get assigned to a task to start tracking work.
      </Card>);
    }
    return (<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((work) => (<WorkCard key={work.id} work={work} />))}
    </div>);
}
