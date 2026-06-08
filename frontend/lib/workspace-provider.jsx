"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

const WorkspaceContext = createContext(null);

const emptyWorkspace = {
    profile: null,
    tasks: [],
    applications: [],
    works: [],
    freelancers: [],
    userId: null,
    userRole: null,
};



export function WorkspaceProvider({ children }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [workspace, setWorkspace] = useState(emptyWorkspace);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = session?.user?.id;

    const refresh = useCallback(async () => {
        if (!userId)
            return;
        try {
            const data = await apiFetch("/api/workspace");
            setWorkspace(data);
            setError(null);
        }
        catch (err) {
            setError(err.message);
        }
    }, [userId]);

    useEffect(() => {
        if (status === "loading")
            return;
        if (!userId) {
            setWorkspace(emptyWorkspace);
            setLoading(false);
            return;
        }
        setLoading(true);
        refresh().finally(() => setLoading(false));
    }, [userId, status, refresh]);

    useEffect(() => {
        if (!userId)
            return undefined;
        const interval = 8000;
        const id = setInterval(refresh, interval);
        return () => clearInterval(id);
    }, [userId, pathname, refresh]);

    const isTaskOwner = useCallback((task) => {
        return task?.creatorId === userId;
    }, [userId]);

    const createTask = useCallback(async (input) => {
        const { task } = await apiFetch("/api/tasks", { method: "POST", body: JSON.stringify(input) });
        await refresh();
        return task;
    }, [refresh]);

    const updateTask = useCallback(async (id, input) => {
        await apiFetch(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(input) });
        await refresh();
    }, [refresh]);

    const deleteTask = useCallback(async (id) => {
        await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
        await refresh();
    }, [refresh]);

    const applyToTask = useCallback(async (taskId, _freelancerId, coverLetter, proposedRate = "") => {
        const { application } = await apiFetch("/api/applications", {
            method: "POST",
            body: JSON.stringify({ taskId, coverLetter, proposedRate }),
        });
        await refresh();
        return application;
    }, [refresh]);

    const updateApplicationStatus = useCallback(async (applicationId, status) => {
        await apiFetch(`/api/applications/${applicationId}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
        await refresh();
    }, [refresh]);

    const updateWorkProgress = useCallback(async (workId, progress) => {
        await apiFetch(`/api/works/${workId}`, {
            method: "PATCH",
            body: JSON.stringify({ progress }),
        });
        await refresh();
    }, [refresh]);



    const exploreTasks = useMemo(() => workspace.tasks.filter((t) => t.status === "Open" && t.creatorId !== userId), [workspace.tasks, userId]);
    const myPostedTasks = useMemo(() => workspace.tasks.filter((t) => t.creatorId === userId), [workspace.tasks, userId]);
    const assignedTasks = useMemo(() => workspace.tasks.filter((t) => t.assignedFreelancerId && t.creatorId === userId), [workspace.tasks, userId]);

    const taskApi = useMemo(() => ({
        tasks: workspace.tasks,
        applications: workspace.applications,
        works: workspace.works,
        freelancers: workspace.freelancers,
        loading,
        error,
        refresh,
        createTask,
        updateTask,
        deleteTask,
        applyToTask,
        updateApplicationStatus,
        updateWorkProgress,
        getTask: (id) => workspace.tasks.find((t) => t.id === id),
        getWorkForTask: (taskId) => workspace.works.find((w) => w.taskId === taskId),
        getMyWorks: () => workspace.works.filter((w) => w.freelancerId === userId),
        getApplicationsForTask: (taskId) => workspace.applications.filter((a) => a.taskId === taskId),
        getFreelancer: (id) => {
            const fromList = workspace.freelancers.find((f) => f.id === id);
            if (fromList)
                return fromList;
            const fromApplication = workspace.applications.find((a) => a.freelancerId === id);
            if (fromApplication) {
                return {
                    id,
                    name: "Freelancer",
                    headline: "",
                    location: "",
                    skills: [],
                    rate: fromApplication.proposedRate || "$—/hr",
                    match: 85,
                    available: true,
                };
            }
            return undefined;
        },
        hasApplied: (taskId) => workspace.applications.some((a) => a.taskId === taskId && a.freelancerId === userId),
        isTaskOwner,
        exploreTasks,
        myPostedTasks,
        openTasks: exploreTasks,
        assignedTasks,
        myAssignedCollaborations: workspace.tasks.filter((t) => t.assignedFreelancerId),
        userId,
        userRole: workspace.userRole,
    }), [workspace, loading, error, refresh, createTask, updateTask, deleteTask, applyToTask, updateApplicationStatus, updateWorkProgress, isTaskOwner, exploreTasks, myPostedTasks, assignedTasks, userId]);

    const profileApi = useMemo(() => ({
        profile: workspace.profile ?? {
            fullName: "",
            headline: "",
            email: session?.user?.email ?? "",
            location: "",
            hourlyRate: "",
            available: true,
            bio: "",
            skills: [],
            experience: [],
            links: { github: "", linkedin: "", portfolio: "" },
            resume: { fileName: "", updatedAt: "", size: "" },
        },
        loading,
        updateProfile: async (updates) => {
            const { profile } = await apiFetch("/api/profile", {
                method: "PATCH",
                body: JSON.stringify(updates),
            });
            setWorkspace((prev) => ({ ...prev, profile }));
            return profile;
        },
        setSkills: async (skills) => {
            await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify({ skills }) });
            await refresh();
        },
        addSkill: async (skill) => {
            const trimmed = skill.trim();
            if (!trimmed)
                return;
            const skills = workspace.profile?.skills ?? [];
            if (skills.includes(trimmed))
                return;
            await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify({ skills: [...skills, trimmed] }) });
            await refresh();
        },
        removeSkill: async (skill) => {
            const skills = (workspace.profile?.skills ?? []).filter((s) => s !== skill);
            await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify({ skills }) });
            await refresh();
        },
        addExperience: async (entry) => {
            const experience = [{ ...entry, id: `exp-${Date.now()}` }, ...(workspace.profile?.experience ?? [])];
            await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify({ experience }) });
            await refresh();
        },
        updateExperience: async (id, updates) => {
            const experience = (workspace.profile?.experience ?? []).map((e) => e.id === id ? { ...e, ...updates } : e);
            await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify({ experience }) });
            await refresh();
        },
        deleteExperience: async (id) => {
            const experience = (workspace.profile?.experience ?? []).filter((e) => e.id !== id);
            await apiFetch("/api/profile", { method: "PATCH", body: JSON.stringify({ experience }) });
            await refresh();
        },
        resetProfile: async () => refresh(),
    }), [workspace.profile, loading, session?.user?.email, refresh]);

    return (
        <WorkspaceContext.Provider value={{ task: taskApi, profile: profileApi }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useTaskStore() {
    const ctx = useContext(WorkspaceContext);
    if (!ctx)
        throw new Error("useTaskStore must be used within WorkspaceProvider");
    return ctx.task;
}

export function useProfileStore() {
    const ctx = useContext(WorkspaceContext);
    if (!ctx)
        throw new Error("useProfileStore must be used within WorkspaceProvider");
    return ctx.profile;
}

export function useWorkspace() {
    const ctx = useContext(WorkspaceContext);
    if (!ctx)
        throw new Error("useWorkspace must be used within WorkspaceProvider");
    return ctx;
}
