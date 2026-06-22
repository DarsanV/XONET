"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";

export function SignupForm() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("both");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const normalizedEmail = email.trim().toLowerCase();
            await apiFetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ fullName: fullName.trim(), email: normalizedEmail, password, role }),
            });
            const result = await signIn("credentials", {
                email: normalizedEmail,
                password,
                redirect: false,
            });
            if (result?.error) {
                toast.error(result.error || "Account created — please sign in");
                router.push("/login");
                return;
            }
            toast.success("Account created");
            router.push("/");
            router.refresh();
        }
        catch (err) {
            toast.error(err.message || "Registration failed");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
                <p className="text-sm text-muted-foreground">
                    One account for client and freelancer workflows
                </p>
            </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full name</Label>
                        <Input
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="h-10 border-border bg-background"
                            placeholder="Your full name"
                            suppressHydrationWarning
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                        <Input
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
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                        <Input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-10 border-border bg-background"
                            placeholder="At least 8 characters"
                            suppressHydrationWarning
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="h-10 border-border bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="freelancer">Freelancer</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="h-10 w-full" disabled={loading} suppressHydrationWarning>
                        {loading ? "Creating account…" : "Sign up"}
                    </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground lg:text-left">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </p>
        </div>
    );
}
