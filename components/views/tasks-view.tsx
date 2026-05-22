"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pencil, Trash2, Plus, Eye, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/tasks/PageHeader";
import { TaskForm } from "@/components/tasks/TaskForm";
import { SkillTags } from "@/components/tasks/SkillTags";
import { TaskDetailSheet } from "@/components/tasks/TaskDetailSheet";
import { TaskChatPanel } from "@/components/tasks/TaskChatPanel";
import { AssignedTaskCard } from "@/components/tasks/AssignedTaskCard";
import { TaskApplicationsPanel } from "@/components/tasks/TaskApplicationsPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTaskStore } from "@/lib/task-store";
import type { PaymentStatus, Task, TaskStatus } from "@/lib/types";
import { toast } from "sonner";

export function TasksView() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { tasks, applications, assignedTasks, updateTask, deleteTask, getFreelancer } =
    useTaskStore();
  const [mainTab, setMainTab] = useState(tabParam === "applications" ? "applications" : "posted");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [chatTask, setChatTask] = useState<Task | null>(null);

  useEffect(() => {
    if (tabParam === "applications") setMainTab("applications");
  }, [tabParam]);

  const postedTasks = tasks.filter((t) => !t.assignedFreelancerId || t.status === "Open");

  function handleStatusChange(id: string, status: TaskStatus) {
    updateTask(id, {
      status,
      paymentStatus:
        status === "Completed" ? "Paid" : status === "In Progress" ? "Partial" : undefined,
    });
    toast.success(`Task marked as ${status}`);
  }

  function handlePaymentChange(id: string, paymentStatus: PaymentStatus) {
    updateTask(id, { paymentStatus });
    toast.success(`Payment status updated to ${paymentStatus}`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tasks"
        title="Task management"
        description="Collaborate with assigned freelancers, track live progress, and manage postings."
        action={
          <Button asChild className="h-10 gap-2 rounded-md px-5">
            <Link href="/tasks/create">
              <Plus className="h-4 w-4" /> Create Task
            </Link>
          </Button>
        }
      />

      <section className="space-y-4 animate-in fade-in duration-300">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Assigned tasks</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live progress and collaboration synced from freelancer work updates.
            </p>
          </div>
          <span className="rounded-md border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            {assignedTasks.length} active collaboration
            {assignedTasks.length === 1 ? "" : "s"}
          </span>
        </div>

        {assignedTasks.length === 0 ? (
          <Card className="border-border bg-card py-12 text-center text-sm text-muted-foreground">
            No assigned tasks yet. Accept an application to start collaborating.
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {assignedTasks.map((task) => {
              const freelancer = task.assignedFreelancerId
                ? getFreelancer(task.assignedFreelancerId)
                : undefined;
              if (!freelancer) return null;
              return (
                <AssignedTaskCard
                  key={task.id}
                  task={task}
                  freelancer={freelancer}
                  onView={() => setDetailTask(task)}
                  onOpenChat={() => setChatTask(task)}
                />
              );
            })}
          </div>
        )}
      </section>

      <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-4">
        <TabsList className="bg-card">
          <TabsTrigger value="posted">Posted tasks</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posted" className="space-y-4">
          <PostedTasksTable
            tasks={postedTasks}
            onView={setDetailTask}
            onEdit={setEditTask}
            onDelete={setDeleteId}
            onOpenChat={setChatTask}
            onStatusChange={handleStatusChange}
            onPaymentChange={handlePaymentChange}
          />
        </TabsContent>

        <TabsContent value="applications">
          <TaskApplicationsPanel showTaskColumn />
        </TabsContent>
      </Tabs>

      <TaskDetailSheet
        task={detailTask}
        open={!!detailTask}
        onOpenChange={(o) => !o && setDetailTask(null)}
        onOpenChat={(t) => {
          setDetailTask(null);
          setChatTask(t);
        }}
      />

      <TaskChatPanel
        task={chatTask}
        open={!!chatTask}
        onOpenChange={(o) => !o && setChatTask(null)}
      />

      <Dialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>
              Update project details. Changes sync across Explore and Tasks.
            </DialogDescription>
          </DialogHeader>
          {editTask && (
            <TaskForm
              defaultValues={editTask}
              submitLabel="Save changes"
              onCancel={() => setEditTask(null)}
              onSubmit={(data) => {
                updateTask(editTask.id, data);
                toast.success("Task updated");
                setEditTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the task and all related applications. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) {
                  deleteTask(deleteId);
                  toast.success("Task deleted");
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PostedTasksTable({
  tasks,
  onView,
  onEdit,
  onDelete,
  onOpenChat,
  onStatusChange,
  onPaymentChange,
}: {
  tasks: Task[];
  onView: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onOpenChat: (t: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onPaymentChange: (id: string, payment: PaymentStatus) => void;
}) {
  if (tasks.length === 0) {
    return (
      <Card className="border-border bg-card py-16 text-center text-sm text-muted-foreground">
        No open postings. Create a task or check assigned collaborations above.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Project
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Budget
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Payment
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Deadline
            </TableHead>
            <TableHead className="w-[160px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="border-border">
              <TableCell>
                <p className="font-medium">{task.title}</p>
                <div className="mt-2 max-w-xs">
                  <SkillTags skills={task.skills} max={3} />
                </div>
              </TableCell>
              <TableCell className="font-semibold">{task.budget}</TableCell>
              <TableCell>
                <Select
                  value={task.status}
                  onValueChange={(v) => onStatusChange(task.id, v as TaskStatus)}
                >
                  <SelectTrigger className="h-8 w-[130px] border-border bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={task.paymentStatus}
                  onValueChange={(v) => onPaymentChange(task.id, v as PaymentStatus)}
                >
                  <SelectTrigger className="h-8 w-[100px] border-border bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-muted-foreground">{task.deadline}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  {task.assignedFreelancerId && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title="Open chat"
                      onClick={() => onOpenChat(task)}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title="View details"
                    onClick={() => onView(task)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onEdit(task)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(task.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
