"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetchPublic } from "@/lib/api-client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }
        if (!token) {
            toast.error("Invalid reset link");
            return;
        }
        setLoading(true);
        try {
            await apiFetchPublic("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
            });
            setDone(true);
            toast.success("Password reset successfully");
        } catch (err) {
            toast.error(err.message || "Could not reset password");
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="mx-auto w-full max-w-sm space-y-4 text-center lg:text-left">
                <h1 className="text-3xl font-semibold tracking-tight">Invalid link</h1>
                <p className="text-sm text-muted-foreground">This password reset link is invalid or has expired.</p>
                <Button asChild className="h-10 w-full">
                    <Link href="/forgot-password">Request a new link</Link>
                </Button>
            </div>
        );
    }

    if (done) {
        return (
            <div className="mx-auto w-full max-w-sm space-y-6 text-center lg:text-left">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary lg:mx-0">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Password updated</h1>
                    <p className="text-sm text-muted-foreground">You can now sign in with your new password.</p>
                </div>
                <Button className="h-10 w-full" onClick={() => router.push("/login")}>
                    Sign in
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
                <p className="text-sm text-muted-foreground">Choose a new password for your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">New password</Label>
                    <Input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 border-border bg-background"
                        placeholder="At least 8 characters"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirm password</Label>
                    <Input
                        type="password"
                        required
                        minLength={8}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="h-10 border-border bg-background"
                        placeholder="Repeat your password"
                    />
                </div>
                <Button type="submit" className="h-10 w-full" disabled={loading}>
                    {loading ? "Updating…" : "Update password"}
                </Button>
            </form>
        </div>
    );
}
