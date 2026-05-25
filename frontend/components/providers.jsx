"use client";

import { SessionProvider } from "next-auth/react";
import { WorkspaceProvider } from "@/lib/workspace-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }) {
    return (
        <SessionProvider refetchOnWindowFocus>
            <WorkspaceProvider>
                <TooltipProvider>
                    {children}
                    <Toaster position="bottom-right" theme="dark" />
                </TooltipProvider>
            </WorkspaceProvider>
        </SessionProvider>
    );
}
