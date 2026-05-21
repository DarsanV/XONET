"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pencil, Trash2, Plus, UserCheck, Eye } from "lucide-react";
import { PageHeader } from "@/components/tasks/PageHeader";
import { TaskForm } from "@/components/tasks/TaskForm";
import { SkillTags } from "@/components/tasks/SkillTags";
import { TaskDetailSheet } from "@/components/tasks/TaskDetailSheet";
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
  const { tasks, applications, updateTask, deleteTask, getFreelancer } = useTaskStore();
  const [mainTab, setMainTab] = useState(tabParam === "applications" ? "applications" : "tasks");
  const [statusTab, setStatusTab] = useState("all");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  useEffect(() => {
    if (tabParam === "applications") setMainTab("applications");
  }, [tabParam]);

  const open = tasks.filter((t) => t.status === "Open");
  const inProgress = tasks.filter((t) => t.status === "In Progress");
  const completed = tasks.filter((t) => t.status === "Completed");
  const pendingApps = applications.filter((a) => a.status === "Pending");

  const statusFiltered =
    statusTab === "open"
      ? open
      : statusTab === "progress"
        ? inProgress
        : statusTab === "done"
          ? completed
          : tasks;

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
        title="Your posted tasks"
        description="Manage projects, review applications, assign freelancers, and track payments."
        action={
          <Button asChild className="h-10 gap-2 rounded-md px-5">
            <Link href="/tasks/create">
              <Plus className="h-4 w-4" /> Create Task
            </Link>
          </Button>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: "Open", count: open.length },
          { label: "In Progress", count: inProgress.length },
          { label: "Completed", count: completed.length },
          { label: "Pending applications", count: pendingApps.length },
        ].map((s) => (
          <Card
            key={s.label}
            className="border-border bg-card p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.count}</p>
          </Card>
        ))}
      </section>

      <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-4">
        <TabsList className="bg-card">
          <TabsTrigger value="tasks">All tasks</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Tabs value={statusTab} onValueChange={setStatusTab} className="space-y-4">
            <TabsList className="bg-card">
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="progress">In Progress</TabsTrigger>
              <TabsTrigger value="done">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          <TasksTable
            tasks={statusFiltered}
            getFreelancer={getFreelancer}
            onView={setDetailTask}
            onEdit={setEditTask}
            onDelete={setDeleteId}
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

function TasksTable({
  tasks,
  getFreelancer,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onPaymentChange,
}: {
  tasks: Task[];
  getFreelancer: ReturnType<typeof useTaskStore>["getFreelancer"];
  onView: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onPaymentChange: (id: string, payment: PaymentStatus) => void;
}) {
  if (tasks.length === 0) {
    return (
      <Card className="border-border bg-card py-16 text-center text-sm text-muted-foreground">
        No tasks in this view yet.
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
              Assigned
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Payment
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Deadline
            </TableHead>
            <TableHead className="w-[140px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const freelancer = task.assignedFreelancerId
              ? getFreelancer(task.assignedFreelancerId)
              : undefined;
            return (
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
                  {freelancer ? (
                    <span className="flex items-center gap-1.5 text-sm">
                      <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                      {freelancer.name}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                  )}
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
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title="View details & applications"
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
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
