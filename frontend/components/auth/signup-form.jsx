"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiFetchPublic } from "@/lib/api-client";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function SignupForm() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("both");
    const [loading, setLoading] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const data = await apiFetchPublic("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ fullName: fullName.trim(), email: normalizedEmail, password, role }),
            });
            setRegisteredEmail(normalizedEmail);
            toast.success("Account created", {
                description: "Check your email to verify your account.",
            });
            if (data.devVerificationToken) {
                console.info("[dev] Verification token:", data.devVerificationToken);
                console.info(`[dev] Verify at: /verify-email?token=${data.devVerificationToken}`);
            }
        } catch (err) {
            toast.error(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    if (registeredEmail) {
        return (
            <div className="mx-auto w-full max-w-sm space-y-6 text-center lg:text-left">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary lg:mx-0">
                    <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
                    <p className="text-sm text-muted-foreground">
                        We sent a verification link to <span className="font-medium text-foreground">{registeredEmail}</span>.
                        Verify your email before signing in.
                    </p>
                </div>
                <Button className="h-10 w-full" onClick={() => router.push("/login")}>
                    Go to sign in
                </Button>
            </div>
        );
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
            <p className="text-center text-sm text-muted-foreground lg:text-left">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
