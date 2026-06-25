import { API_URL } from "@/lib/api-url";

export async function refreshAccessToken(refreshToken) {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
        throw new Error(json.error || "Session expired");
    }
    return json.data;
}
