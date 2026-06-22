import { getSession, signOut } from "next-auth/react";
import { API_URL } from "@/lib/api-url";

export async function apiFetch(path, options = {}) {
    const session = typeof window !== "undefined" ? await getSession() : null;
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
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
        if (res.status === 401 && typeof window !== "undefined") {
            await signOut({ callbackUrl: "/login" });
        }
        const err = new Error(json.error || "Request failed");
        err.status = res.status;
        throw err;
    }
    return json.data;
}
