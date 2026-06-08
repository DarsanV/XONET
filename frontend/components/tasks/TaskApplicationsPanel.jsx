"use client";
import { Check, X } from "lucide-react";
import { ApplicationStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { useTaskStore } from "@/lib/task-store";
import { toast } from "sonner";
export function TaskApplicationsPanel({ taskId, showTaskColumn = !taskId, }) {
    const { applications, getTask, getFreelancer, updateApplicationStatus, userId } = useTaskStore();
    const filtered = (taskId
        ? applications.filter((a) => a.taskId === taskId)
        : applications.filter((a) => getTask(a.taskId)?.creatorId === userId));
    async function handleAccept(app) {
        try {
            await updateApplicationStatus(app.id, "Accepted");
            toast.success("Application accepted", {
                description: "Freelancer assigned and task moved to In Progress.",
            });
        }
        catch (err) {
            toast.error(err.message || "Could not accept application");
        }
    }
    async function handleReject(app) {
        try {
            await updateApplicationStatus(app.id, "Rejected");
            toast.success("Application rejected");
        }
        catch (err) {
            toast.error(err.message || "Could not reject application");
        }
    }
    if (filtered.length === 0) {
        return (<Card className="border-border bg-card py-16 text-center text-sm text-muted-foreground">
        {taskId ? "No applications for this task yet." : "No applications yet."}
      </Card>);
    }
    return (<Card className="overflow-hidden border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            {showTaskColumn && (<TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Task
              </TableHead>)}
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Freelancer
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Proposal
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Rate
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="w-[200px]"/>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((app) => {
            const task = getTask(app.taskId);
            const freelancer = getFreelancer(app.freelancerId);
            return (<TableRow key={app.id} className="border-border">
                {showTaskColumn && (<TableCell className="max-w-[180px]">
                    <p className="font-medium leading-snug">{task?.title ?? "Unknown"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{task?.budget}</p>
                  </TableCell>)}
                <TableCell>
                  <p className="font-medium">{freelancer?.name ?? "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{freelancer?.headline}</p>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{app.coverLetter}</p>
                </TableCell>
                <TableCell className="text-sm font-medium">{app.proposedRate || "—"}</TableCell>
                <TableCell>
                  <ApplicationStatusBadge status={app.status}/>
                </TableCell>
                <TableCell>
                  {app.status === "Pending" && task?.status === "Open" && (<div className="flex flex-wrap justify-end gap-1">
                      <Button size="sm" className="h-8 gap-1 rounded-md text-xs" onClick={() => handleAccept(app)}>
                        <Check className="h-3 w-3"/> Accept & assign
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 gap-1 rounded-md text-xs text-destructive hover:text-destructive" onClick={() => handleReject(app)}>
                        <X className="h-3 w-3"/> Reject
                      </Button>
                    </div>)}
                  {app.status === "Pending" && task?.status !== "Open" && (
                    <span className="text-xs text-muted-foreground">Task closed</span>
                  )}
                </TableCell>
              </TableRow>);
        })}
        </TableBody>
      </Table>
    </Card>);
}
