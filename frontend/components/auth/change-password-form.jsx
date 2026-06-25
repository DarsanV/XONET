"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";

export function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        setLoading(true);
        try {
            await apiFetch("/api/auth/change-password", {
                method: "POST",
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            toast.success("Password changed", {
                description: "Please sign in again with your new password.",
            });
            await signOut({ callbackUrl: "/login" });
        } catch (err) {
            toast.error(err.message || "Could not change password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="text-base">Password</CardTitle>
                <CardDescription>Update your password. You&apos;ll be signed out of all sessions.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Current password</Label>
                        <Input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="h-10 border-border bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">New password</Label>
                        <Input
                            type="password"
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-10 border-border bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirm new password</Label>
                        <Input
                            type="password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-10 border-border bg-background"
                        />
                    </div>
                    <Button type="submit" variant="secondary" className="h-10" disabled={loading}>
                        {loading ? "Updating…" : "Change password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
