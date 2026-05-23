"use client";
import { ProfileStoreProvider } from "@/lib/profile-store";
import { TaskStoreProvider } from "@/lib/task-store";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
export function Providers({ children }) {
    return (<TaskStoreProvider>
      <ProfileStoreProvider>
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" theme="dark"/>
        </TooltipProvider>
      </ProfileStoreProvider>
    </TaskStoreProvider>);
}
