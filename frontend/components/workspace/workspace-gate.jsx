"use client";

import { useSession } from "next-auth/react";
import { useTaskStore } from "@/lib/task-store";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceGate({ children }) {
    const { status } = useSession();
    const { loading } = useTaskStore();

    if (status === "loading" || loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-lg" />
                    ))}
                </div>
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        );
    }

    return children;
}
