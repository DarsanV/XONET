"use client";

import { TaskStoreProvider } from "@/lib/task-store";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TaskStoreProvider>
      <TooltipProvider>
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </TooltipProvider>
    </TaskStoreProvider>
  );
}
