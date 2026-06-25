"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api-client";

const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 12_000;
let externalRefresh = null;

export function triggerNotificationRefresh() {
    externalRefresh?.();
}

export function NotificationProvider({ children }) {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await apiFetch("/api/notifications?limit=30");
            setNotifications(data.notifications ?? []);
            setUnreadCount(data.unreadCount ?? 0);
        } catch {
            // session handler will sign out on auth errors
        }
    }, [userId]);

    useEffect(() => {
        if (status === "loading") return;
        if (!userId) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }
        setLoading(true);
        refresh().finally(() => setLoading(false));
    }, [userId, status, refresh]);

    useEffect(() => {
        if (!userId) return undefined;
        const id = setInterval(refresh, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [userId, refresh]);

    useEffect(() => {
        externalRefresh = refresh;
        return () => {
            if (externalRefresh === refresh) externalRefresh = null;
        };
    }, [refresh]);

    const markRead = useCallback(async (id) => {
        const data = await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(data.unreadCount ?? 0);
    }, []);

    const markAllRead = useCallback(async () => {
        await apiFetch("/api/notifications/read-all", { method: "PATCH" });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    const remove = useCallback(async (id) => {
        const data = await apiFetch(`/api/notifications/${id}`, { method: "DELETE" });
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnreadCount(data.unreadCount ?? 0);
    }, []);

    const value = useMemo(() => ({
        notifications,
        unreadCount,
        loading,
        refresh,
        markRead,
        markAllRead,
        remove,
    }), [notifications, unreadCount, loading, refresh, markRead, markAllRead, remove]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return ctx;
}
