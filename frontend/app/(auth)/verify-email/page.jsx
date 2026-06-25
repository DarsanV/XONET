import { Suspense } from "react";
import { VerifyEmailView } from "@/components/auth/verify-email-view";

export const metadata = {
    title: "Verify Email",
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="text-sm text-muted-foreground">Verifying…</div>}>
            <VerifyEmailView />
        </Suspense>
    );
}
