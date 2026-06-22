"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const result = await signIn("credentials", {
            email: email.trim().toLowerCase(),
            password,
            redirect: false,
        });
        setLoading(false);
        if (result?.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Welcome back");
        router.push(callbackUrl);
        router.refresh();
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
                        <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                            Password
                        </Label>
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
                <p className="mt-6 text-center text-sm text-muted-foreground lg:text-left">
                    No account?{" "}
                    <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
                        Create one
                    </Link>
                </p>
        </div>
    );
}
