"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  seedApplications,
  seedFreelancers,
  seedTasks,
} from "@/lib/dummy-data";
import type {
  Application,
  ApplicationStatus,
  CreateTaskInput,
  Freelancer,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/lib/types";

const STORAGE_KEY = "xonet-task-store-v1";

type StoreState = {
  tasks: Task[];
  applications: Application[];
};

type TaskStoreValue = {
  tasks: Task[];
  applications: Application[];
  freelancers: Freelancer[];
  createTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  applyToTask: (
    taskId: string,
    freelancerId: string,
    coverLetter: string,
    proposedRate?: string,
  ) => Application | null;
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus,
  ) => void;
  assignFreelancer: (taskId: string, freelancerId: string) => void;
  getTask: (id: string) => Task | undefined;
  getApplicationsForTask: (taskId: string) => Application[];
  getFreelancer: (id: string) => Freelancer | undefined;
  hasApplied: (taskId: string, freelancerId: string) => boolean;
  openTasks: Task[];
};

function loadState(): StoreState {
  if (typeof window === "undefined") {
    return { tasks: seedTasks, applications: seedApplications };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: seedTasks, applications: seedApplications };
    const parsed = JSON.parse(raw) as StoreState;
    return {
      tasks: parsed.tasks?.length ? parsed.tasks : seedTasks,
      applications: parsed.applications ?? seedApplications,
    };
  } catch {
    return { tasks: seedTasks, applications: seedApplications };
  }
}

let state: StoreState = loadState();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function setState(next: StoreState) {
  state = next;
  persist();
  emit();
}

function randomMatch(): number {
  return Math.floor(75 + Math.random() * 24);
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const TaskStoreContext = createContext<TaskStoreValue | null>(null);

export function TaskStoreProvider({ children }: { children: ReactNode }) {
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );

  const createTask = useCallback((input: CreateTaskInput): Task => {
    const task: Task = {
      id: generateId("task"),
      ...input,
      status: "Open",
      match: randomMatch(),
      paymentStatus: "Unpaid",
      createdAt: new Date().toISOString(),
    };
    setState({ ...state, tasks: [task, ...state.tasks] });
    return task;
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setState({
      ...state,
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...input } : t)),
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState({
      tasks: state.tasks.filter((t) => t.id !== id),
      applications: state.applications.filter((a) => a.taskId !== id),
    });
  }, []);

  const applyToTask = useCallback(
    (
      taskId: string,
      freelancerId: string,
      coverLetter: string,
      proposedRate = "",
    ): Application | null => {
      if (state.applications.some((a) => a.taskId === taskId && a.freelancerId === freelancerId)) {
        return null;
      }
      const application: Application = {
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
    },
    [],
  );

  const updateApplicationStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) => {
      const app = state.applications.find((a) => a.id === applicationId);
      if (!app) return;

      let tasks = state.tasks;
      let applications = state.applications.map((a) =>
        a.id === applicationId ? { ...a, status } : a,
      );

      if (status === "Accepted") {
        applications = applications.map((a) =>
          a.taskId === app.taskId && a.id !== applicationId
            ? { ...a, status: "Rejected" as ApplicationStatus }
            : a,
        );
        tasks = tasks.map((t) =>
          t.id === app.taskId
            ? {
                ...t,
                status: "In Progress" as TaskStatus,
                assignedFreelancerId: app.freelancerId,
                paymentStatus: "Partial" as const,
              }
            : t,
        );
      }

      setState({ tasks, applications });
    },
    [],
  );

  const assignFreelancer = useCallback((taskId: string, freelancerId: string) => {
    setState({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "In Progress",
              assignedFreelancerId: freelancerId,
              paymentStatus: t.paymentStatus === "Paid" ? "Paid" : "Partial",
            }
          : t,
      ),
    });
  }, []);

  const value: TaskStoreValue = {
    tasks: state.tasks,
    applications: state.applications,
    freelancers: seedFreelancers,
    createTask,
    updateTask,
    deleteTask,
    applyToTask,
    updateApplicationStatus,
    assignFreelancer,
    getTask: (id) => state.tasks.find((t) => t.id === id),
    getApplicationsForTask: (taskId) =>
      state.applications.filter((a) => a.taskId === taskId),
    getFreelancer: (id) => seedFreelancers.find((f) => f.id === id),
    hasApplied: (taskId, freelancerId) =>
      state.applications.some(
        (a) => a.taskId === taskId && a.freelancerId === freelancerId,
      ),
    openTasks: state.tasks.filter((t) => t.status === "Open"),
  };

  return (
    <TaskStoreContext.Provider value={value}>{children}</TaskStoreContext.Provider>
  );
}

export function useTaskStore() {
  const ctx = useContext(TaskStoreContext);
  if (!ctx) throw new Error("useTaskStore must be used within TaskStoreProvider");
  return ctx;
}
