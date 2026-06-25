"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetchPublic } from "@/lib/api-client";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await apiFetchPublic("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });
            setSent(true);
            toast.success("Check your email", {
                description: data.message,
            });
            if (data.devResetToken) {
                console.info("[dev] Reset token:", data.devResetToken);
                console.info(`[dev] Reset at: /reset-password?token=${data.devResetToken}`);
            }
        } catch (err) {
            toast.error(err.message || "Could not send reset email");
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div className="mx-auto w-full max-w-sm space-y-6 text-center lg:text-left">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary lg:mx-0">
                    <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
                    <p className="text-sm text-muted-foreground">
                        If an account exists for <span className="font-medium text-foreground">{email}</span>, we sent a password reset link.
                    </p>
                </div>
                <Button asChild variant="secondary" className="h-10 w-full">
                    <Link href="/login">Back to sign in</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-semibold tracking-tight">Forgot password</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you a reset link
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 border-border bg-background"
                        placeholder="you@company.com"
                    />
                </div>
                <Button type="submit" className="h-10 w-full" disabled={loading}>
                    {loading ? "Sending…" : "Send reset link"}
                </Button>
            </form>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
        </div>
    );
}
