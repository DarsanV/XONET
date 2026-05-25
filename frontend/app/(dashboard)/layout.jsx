import { AppLayout } from "@/components/layout/AppLayout";
import { WorkspaceGate } from "@/components/workspace/workspace-gate";

export default function DashboardLayout({ children }) {
    return (
        <AppLayout>
            <WorkspaceGate>{children}</WorkspaceGate>
        </AppLayout>
    );
}
