"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiFetchPublic } from "@/lib/api-client";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const urlError = searchParams.get("error");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [showResend, setShowResend] = useState(false);

    useEffect(() => {
        if (urlError === "session_expired") {
            toast.error("Your session has expired. Please sign in again.");
        }
        if (urlError === "email_not_verified") {
            toast.error("Please verify your email before accessing the workspace.");
            setShowResend(true);
        }
    }, [urlError]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setShowResend(false);
        const normalizedEmail = email.trim().toLowerCase();
        const result = await signIn("credentials", {
            email: normalizedEmail,
            password,
            redirect: false,
        });
        setLoading(false);
        if (result?.error) {
            if (result.error === "EMAIL_NOT_VERIFIED") {
                toast.error("Please verify your email before signing in.");
                setShowResend(true);
                return;
            }
            toast.error(result.error);
            return;
        }
        toast.success("Welcome back");
        router.push(callbackUrl);
        router.refresh();
    }

    async function handleResend() {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            toast.error("Enter your email address first");
            return;
        }
        setResending(true);
        try {
            await apiFetchPublic("/api/auth/resend-verification", {
                method: "POST",
                body: JSON.stringify({ email: normalizedEmail }),
            });
            toast.success("Verification email sent", {
                description: "Check your inbox and spam folder.",
            });
        } catch (err) {
            toast.error(err.message || "Could not resend verification email");
        } finally {
            setResending(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to access your workspace
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
                        suppressHydrationWarning
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                            Password
                        </Label>
                        <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 border-border bg-background"
                        placeholder="••••••••"
                        suppressHydrationWarning
                    />
                </div>
                <Button type="submit" className="h-10 w-full" disabled={loading} suppressHydrationWarning>
                    {loading ? "Signing in…" : "Sign in"}
                </Button>
            </form>
            {showResend && (
                <div className="rounded-lg border border-border bg-card p-4 text-sm">
                    <p className="text-muted-foreground">Haven&apos;t verified your email yet?</p>
                    <Button
                        type="button"
                        variant="secondary"
                        className="mt-3 h-9 w-full"
                        disabled={resending}
                        onClick={handleResend}
                    >
                        {resending ? "Sending…" : "Resend verification email"}
                    </Button>
                </div>
            )}
            <p className="text-center text-sm text-muted-foreground lg:text-left">
                No account?{" "}
                <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Create one
                </Link>
            </p>
        </div>
    );
}
