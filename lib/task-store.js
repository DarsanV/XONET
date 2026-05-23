"use client";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, } from "react";
import { CURRENT_FREELANCER_ID, seedApplications, seedFreelancers, seedMessages, seedTasks, seedWorks, } from "@/lib/dummy-data";
const STORAGE_KEY = "xonet-task-store-v2";
const seedState = {
    tasks: seedTasks,
    applications: seedApplications,
    works: seedWorks,
    messages: seedMessages,
};
function normalizeTask(task) {
    return {
        ...task,
        progress: task.progress ?? 0,
    };
}
function loadState() {
    if (typeof window === "undefined")
        return seedState;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return seedState;
        const parsed = JSON.parse(raw);
        return {
            tasks: (parsed.tasks?.length ? parsed.tasks : seedTasks).map(normalizeTask),
            applications: parsed.applications ?? seedApplications,
            works: parsed.works?.length ? parsed.works : seedWorks,
            messages: { ...seedMessages, ...parsed.messages },
        };
    }
    catch {
        return seedState;
    }
}
let state = seedState;
const listeners = new Set();
function persist() {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
}
function emit() {
    listeners.forEach((l) => l());
}
function setState(next) {
    state = next;
    persist();
    emit();
}
function randomMatch() {
    return Math.floor(75 + Math.random() * 24);
}
function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function formatRelativeTime(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)
        return "Just now";
    if (mins < 60)
        return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)
        return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}
function syncTaskFromWork(taskId, work, freelancerName) {
    const now = new Date().toISOString();
    const activity = `${freelancerName} updated progress to ${work.progress}%`;
    const taskStatus = work.progress >= 100
        ? "Completed"
        : work.progress > 0
            ? "In Progress"
            : state.tasks.find((t) => t.id === taskId)?.status ?? "Open";
    return state.tasks.map((t) => t.id === taskId
        ? {
            ...t,
            progress: work.progress,
            status: taskStatus,
            lastActivity: activity,
            lastActivityAt: now,
            paymentStatus: work.progress >= 100
                ? "Paid"
                : work.progress > 0
                    ? "Partial"
                    : t.paymentStatus,
        }
        : t);
}
function ensureWorkForAssignment(task, freelancerId) {
    const existing = state.works.find((w) => w.taskId === task.id);
    if (existing) {
        return state.works.map((w) => w.taskId === task.id ? { ...w, freelancerId, status: "Active" } : w);
    }
    const freelancer = seedFreelancers.find((f) => f.id === freelancerId);
    const work = {
        id: generateId("work"),
        taskId: task.id,
        freelancerId,
        project: task.title,
        client: "XONET Client",
        status: "Active",
        payment: task.budget,
        progress: task.progress ?? 0,
        deadline: task.deadline,
        lastUpdatedAt: new Date().toISOString(),
    };
    return [work, ...state.works];
}
const TaskStoreContext = createContext(null);
export function TaskStoreProvider({ children }) {
    useSyncExternalStore((cb) => {
        listeners.add(cb);
        return () => listeners.delete(cb);
    }, () => state, () => seedState);
    useEffect(() => {
        setState(loadState());
    }, []);
    const createTask = useCallback((input) => {
        const task = {
            id: generateId("task"),
            ...input,
            status: "Open",
            match: randomMatch(),
            paymentStatus: "Unpaid",
            progress: 0,
            createdAt: new Date().toISOString(),
        };
        setState({ ...state, tasks: [task, ...state.tasks] });
        return task;
    }, []);
    const updateTask = useCallback((id, input) => {
        setState({
            ...state,
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...input } : t)),
        });
    }, []);
    const deleteTask = useCallback((id) => {
        setState({
            tasks: state.tasks.filter((t) => t.id !== id),
            applications: state.applications.filter((a) => a.taskId !== id),
            works: state.works.filter((w) => w.taskId !== id),
            messages: Object.fromEntries(Object.entries(state.messages).filter(([key]) => key !== id)),
        });
    }, []);
    const applyToTask = useCallback((taskId, freelancerId, coverLetter, proposedRate = "") => {
        if (state.applications.some((a) => a.taskId === taskId && a.freelancerId === freelancerId)) {
            return null;
        }
        const application = {
            id: generateId("app"),
            taskId,
            freelancerId,
            coverLetter,
            proposedRate,
            status: "Pending",
            appliedAt: new Date().toISOString(),
        };
        setState({
            ...state,
            applications: [application, ...state.applications],
        });
        return application;
    }, []);
    const updateApplicationStatus = useCallback((applicationId, status) => {
        const app = state.applications.find((a) => a.id === applicationId);
        if (!app)
            return;
        let tasks = state.tasks;
        let works = state.works;
        let applications = state.applications.map((a) => a.id === applicationId ? { ...a, status } : a);
        if (status === "Accepted") {
            applications = applications.map((a) => a.taskId === app.taskId && a.id !== applicationId
                ? { ...a, status: "Rejected" }
                : a);
            const task = tasks.find((t) => t.id === app.taskId);
            if (task) {
                works = ensureWorkForAssignment(task, app.freelancerId);
            }
            tasks = tasks.map((t) => t.id === app.taskId
                ? {
                    ...t,
                    status: "In Progress",
                    assignedFreelancerId: app.freelancerId,
                    paymentStatus: "Partial",
                    progress: t.progress || 5,
                    lastActivity: "Freelancer assigned — collaboration started",
                    lastActivityAt: new Date().toISOString(),
                }
                : t);
        }
        setState({ tasks, applications, works, messages: state.messages });
    }, []);
    const assignFreelancer = useCallback((taskId, freelancerId) => {
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task)
            return;
        const works = ensureWorkForAssignment(task, freelancerId);
        setState({
            ...state,
            works,
            tasks: state.tasks.map((t) => t.id === taskId
                ? {
                    ...t,
                    status: "In Progress",
                    assignedFreelancerId: freelancerId,
                    paymentStatus: t.paymentStatus === "Paid" ? "Paid" : "Partial",
                    progress: t.progress || 5,
                    lastActivity: "Freelancer assigned — collaboration started",
                    lastActivityAt: new Date().toISOString(),
                }
                : t),
        });
    }, []);
    const updateWorkProgress = useCallback((workId, progress) => {
        const work = state.works.find((w) => w.id === workId);
        if (!work)
            return;
        const clamped = Math.min(100, Math.max(0, progress));
        const now = new Date().toISOString();
        const freelancer = seedFreelancers.find((f) => f.id === work.freelancerId);
        const freelancerName = freelancer?.name ?? "Freelancer";
        const updatedWork = {
            ...work,
            progress: clamped,
            status: clamped >= 100 ? "Completed" : clamped >= 90 ? "In Review" : "Active",
            lastUpdatedAt: now,
        };
        const works = state.works.map((w) => (w.id === workId ? updatedWork : w));
        const tasks = syncTaskFromWork(work.taskId, updatedWork, freelancerName);
        setState({ ...state, works, tasks });
    }, []);
    const sendMessage = useCallback((taskId, sender, text, type = "text") => {
        const trimmed = text.trim();
        if (!trimmed)
            return;
        const message = {
            id: generateId("msg"),
            taskId,
            sender,
            text: trimmed,
            type,
            sentAt: new Date().toISOString(),
        };
        const thread = state.messages[taskId] ?? [];
        const senderLabel = sender === "client" ? "You" : "Freelancer";
        const tasks = state.tasks.map((t) => t.id === taskId
            ? {
                ...t,
                lastActivity: type === "progress" 
                    ? `${senderLabel} shared a progress update`
                    : `${senderLabel} sent a message in chat`,
                lastActivityAt: message.sentAt,
            }
            : t);
        setState({
            ...state,
            tasks,
            messages: { ...state.messages, [taskId]: [...thread, message] },
        });
    }, []);
    const value = {
        tasks: state.tasks,
        applications: state.applications,
        works: state.works,
        freelancers: seedFreelancers,
        createTask,
        updateTask,
        deleteTask,
        applyToTask,
        updateApplicationStatus,
        assignFreelancer,
        updateWorkProgress,
        sendMessage,
        getTask: (id) => state.tasks.find((t) => t.id === id),
        getWorkForTask: (taskId) => state.works.find((w) => w.taskId === taskId),
        getMyWorks: (freelancerId = CURRENT_FREELANCER_ID) => state.works.filter((w) => w.freelancerId === freelancerId),
        getMessagesForTask: (taskId) => state.messages[taskId] ?? [],
        getApplicationsForTask: (taskId) => state.applications.filter((a) => a.taskId === taskId),
        getFreelancer: (id) => seedFreelancers.find((f) => f.id === id),
        hasApplied: (taskId, freelancerId) => state.applications.some((a) => a.taskId === taskId && a.freelancerId === freelancerId),
        openTasks: state.tasks.filter((t) => t.status === "Open"),
        assignedTasks: state.tasks.filter((t) => t.assignedFreelancerId),
    };
    return (<TaskStoreContext.Provider value={value}>{children}</TaskStoreContext.Provider>);
}
export function useTaskStore() {
    const ctx = useContext(TaskStoreContext);
    if (!ctx)
        throw new Error("useTaskStore must be used within TaskStoreProvider");
    return ctx;
}
export { formatRelativeTime };
