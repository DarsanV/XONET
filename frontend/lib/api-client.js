import { getSession, signOut } from "next-auth/react";
import { API_URL } from "@/lib/api-url";
import { refreshSession } from "@/lib/session-updater";

export async function apiFetch(path, options = {}) {
    const session = typeof window !== "undefined" ? await getSession() : null;

    if (session?.error === "RefreshAccessTokenError") {
        if (typeof window !== "undefined") {
            await signOut({ callbackUrl: "/login?error=session_expired" });
        }
        throw new Error("Session expired");
    }

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    if (session?.accessToken) {
        headers.Authorization = `Bearer ${session.accessToken}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
    });
    const json = await res.json().catch(() => ({}));

    if ((res.status === 401 || json.code === "TOKEN_EXPIRED") && !options._retry && typeof window !== "undefined") {
        const refreshed = await refreshSession();
        if (refreshed) {
            return apiFetch(path, { ...options, _retry: true });
        }
        await signOut({ callbackUrl: "/login?error=session_expired" });
        throw new Error("Session expired");
    }

    if (!res.ok || json.success === false) {
        if (res.status === 401 && typeof window !== "undefined") {
            await signOut({ callbackUrl: "/login?error=session_expired" });
        }
        if (json.code === "EMAIL_NOT_VERIFIED" && typeof window !== "undefined") {
            await signOut({ callbackUrl: "/login?error=email_not_verified" });
        }
        const err = new Error(json.error || "Request failed");
        err.status = res.status;
        err.code = json.code;
        throw err;
    }
    return json.data;
}

export async function apiFetchPublic(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
        const err = new Error(json.error || "Request failed");
        err.status = res.status;
        err.code = json.code;
        throw err;
    }
    return json.data;
}
