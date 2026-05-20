import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { myWorks, type WorkItem } from "@/lib/dummy-data";

export const Route = createFileRoute("/my-works")({
  head: () => ({
    meta: [
      { title: "My Works — XONET" },
      { name: "description", content: "All your active, completed, and in-review projects." },
    ],
  }),
  component: () => (
    <AppLayout>
      <MyWorks />
    </AppLayout>
  ),
});

function statusStyle(status: WorkItem["status"]) {
  switch (status) {
    case "Active":
      return "bg-foreground/10 text-foreground border border-foreground/20";
    case "Completed":
      return "bg-secondary text-muted-foreground border border-border";
    case "In Review":
      return "bg-accent/15 text-accent border border-accent/30";
  }
}

function WorksTable({ items }: { items: WorkItem[] }) {
  if (items.length === 0) {
    return (
      <div className="grid place-items-center py-20 text-sm text-muted-foreground">
        Nothing here yet.
      </div>
    );
  }
  return (
    <Card className="overflow-hidden border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Project</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Client</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Payment</TableHead>
            <TableHead className="w-[200px] text-[11px] uppercase tracking-wider text-muted-foreground">Progress</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Deadline</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((w) => (
            <TableRow key={w.id} className="border-border">
              <TableCell className="font-medium">{w.project}</TableCell>
              <TableCell className="text-muted-foreground">{w.client}</TableCell>
              <TableCell>
                <Badge className={`rounded-sm px-2 py-0.5 text-[10px] font-medium ${statusStyle(w.status)}`}>
                  {w.status}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold">{w.payment}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Progress value={w.progress} className="h-1.5 bg-secondary" />
                  <span className="w-9 text-xs text-muted-foreground">{w.progress}%</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{w.deadline}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function MyWorks() {
  const active = myWorks.filter((w) => w.status === "Active" || w.status === "In Review");
  const completed = myWorks.filter((w) => w.status === "Completed");

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">My Works</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Your projects</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Track active engagements, monitor progress, and review completed work.
        </p>
      </header>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="bg-card">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="active"><WorksTable items={active} /></TabsContent>
        <TabsContent value="completed"><WorksTable items={completed} /></TabsContent>
        <TabsContent value="all"><WorksTable items={myWorks} /></TabsContent>
      </Tabs>
    </div>
  );
}
