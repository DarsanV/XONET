"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { WorkspaceProvider } from "@/lib/workspace-provider";
import { NotificationProvider } from "@/lib/notification-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { registerSessionUpdater } from "@/lib/session-updater";

function SessionRefresher() {
    const { update } = useSession();
    useEffect(() => {
        registerSessionUpdater(update);
    }, [update]);
    return null;
}

export function Providers({ children }) {
    return (
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
            <SessionRefresher />
            <NotificationProvider>
                <WorkspaceProvider>
                    <TooltipProvider>
                        {children}
                        <Toaster position="bottom-right" theme="dark" />
                    </TooltipProvider>
                </WorkspaceProvider>
            </NotificationProvider>
        </SessionProvider>
    );
}
