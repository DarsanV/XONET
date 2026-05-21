import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus, PaymentStatus, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const taskStyles: Record<TaskStatus, string> = {
  Open: "bg-foreground/10 text-foreground border border-foreground/20",
  "In Progress": "bg-accent/15 text-accent border border-accent/30",
  Completed: "bg-secondary text-muted-foreground border border-border",
};

const appStyles: Record<ApplicationStatus, string> = {
  Pending: "bg-secondary text-foreground border border-border",
  Accepted: "bg-foreground/10 text-foreground border border-foreground/20",
  Rejected: "bg-destructive/10 text-destructive border border-destructive/30",
};

const paymentStyles: Record<PaymentStatus, string> = {
  Unpaid: "bg-secondary text-muted-foreground border border-border",
  Partial: "bg-accent/15 text-accent border border-accent/30",
  Paid: "bg-foreground/10 text-foreground border border-foreground/20",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge className={cn("rounded-sm px-2 py-0.5 text-[10px] font-medium", taskStyles[status])}>
      {status}
    </Badge>
  );
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge className={cn("rounded-sm px-2 py-0.5 text-[10px] font-medium", appStyles[status])}>
      {status}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge className={cn("rounded-sm px-2 py-0.5 text-[10px] font-medium", paymentStyles[status])}>
      {status}
    </Badge>
  );
}
