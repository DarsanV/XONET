"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetchPublic } from "@/lib/api-client";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export function VerifyEmailView() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Verification token is missing.");
            return;
        }
        apiFetchPublic(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
            .then((data) => {
                setStatus("success");
                setMessage(data.message);
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.message || "Verification failed");
            });
    }, [token]);

    return (
        <div className="mx-auto w-full max-w-sm space-y-6 text-center lg:text-left">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary lg:mx-0">
                {status === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
                {status === "success" && <CheckCircle2 className="h-6 w-6" />}
                {status === "error" && <XCircle className="h-6 w-6" />}
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                    {status === "loading" && "Verifying email…"}
                    {status === "success" && "Email verified"}
                    {status === "error" && "Verification failed"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {status === "loading" ? "Please wait while we confirm your email address." : message}
                </p>
            </div>
            {status !== "loading" && (
                <Button asChild className="h-10 w-full">
                    <Link href="/login">{status === "success" ? "Sign in" : "Back to sign in"}</Link>
                </Button>
            )}
        </div>
    );
}
