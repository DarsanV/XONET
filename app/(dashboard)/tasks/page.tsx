import type { Metadata } from "next";
import { Suspense } from "react";
import { TasksView } from "@/components/views";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage posted tasks, assignments, applications, and payments.",
};

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading tasks…</div>}>
      <TasksView />
    </Suspense>
  );
}
