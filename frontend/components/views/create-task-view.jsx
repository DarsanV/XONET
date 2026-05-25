"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/tasks/PageHeader";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/lib/task-store";
import { toast } from "sonner";
export function CreateTaskView() {
    const router = useRouter();
    const { createTask } = useTaskStore();
    return (<div className="space-y-8">
      <Button variant="ghost" asChild className="h-9 gap-2 px-0 text-muted-foreground hover:text-foreground">
        <Link href="/tasks">
          <ArrowLeft className="h-4 w-4"/> Back to Tasks
        </Link>
      </Button>

      <PageHeader eyebrow="Create task" title="Post a new project" description="Define scope, budget, and skills. Your task will appear on Explore and Tasks instantly."/>

      <Card className="border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Project details</CardTitle>
          <CardDescription className="text-xs">
            All fields are required unless marked optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm onSubmit={async (data) => {
            try {
                const task = await createTask(data);
                toast.success("Task created", {
                    description: `"${task.title}" is saved to your workspace.`,
                });
                router.push("/tasks");
            }
            catch (err) {
                toast.error(err.message || "Failed to create task");
            }
        }}/>
        </CardContent>
      </Card>
    </div>);
}
