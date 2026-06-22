"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Briefcase, DollarSign, CheckCircle2, Sparkles, ArrowUpRight, TrendingUp } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/lib/task-store";
import { useProfileStore } from "@/lib/profile-store";
import { TaskCard } from "@/components/tasks/TaskCard";

function parseBudget(value) {
    const amount = parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(amount) ? amount : 0;
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function DashboardView() {
    const { openTasks, tasks, works, myPostedTasks } = useTaskStore();
    const { profile } = useProfileStore();
    const featured = openTasks.slice(0, 3);

    const firstName = profile.fullName?.split(" ")[0] || "there";

    const activeProjects = useMemo(() => {
        const inProgress = tasks.filter((t) => t.status === "In Progress").length;
        const activeWorks = works.filter((w) => w.status === "Active" || w.status === "In Review").length;
        return inProgress + activeWorks;
    }, [tasks, works]);

    const earningsThisMonth = useMemo(() => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        let total = 0;
        for (const work of works) {
            if (work.status === "Completed" && new Date(work.lastUpdatedAt) >= monthStart) {
                total += parseBudget(work.payment);
            }
        }
        for (const task of tasks) {
            if (task.status === "Completed" && task.paymentStatus === "Paid" && new Date(task.createdAt) >= monthStart) {
                total += parseBudget(task.budget);
            }
        }
        return total;
    }, [works, tasks]);

    const completionRate = useMemo(() => {
        const relevantTasks = tasks.filter((t) => t.status !== "Open");
        const completedTasks = relevantTasks.filter((t) => t.status === "Completed").length;
        const completedWorks = works.filter((w) => w.status === "Completed").length;
        const total = relevantTasks.length + works.length;
        if (total === 0) return 0;
        return Math.round(((completedTasks + completedWorks) / total) * 100);
    }, [tasks, works]);

    const avgMatch = useMemo(() => {
        if (openTasks.length === 0) return 0;
        return Math.round(openTasks.reduce((sum, t) => sum + (t.match ?? 0), 0) / openTasks.length);
    }, [openTasks]);

    const stats = [
        {
            label: "Active Projects",
            value: String(activeProjects),
            delta: activeProjects === 1 ? "1 in progress" : `${activeProjects} in progress`,
            icon: Briefcase,
        },
        {
            label: "Earnings this month",
            value: formatCurrency(earningsThisMonth),
            delta: earningsThisMonth > 0 ? "From completed work" : "No completed payouts yet",
            icon: DollarSign,
        },
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            delta: completionRate > 0 ? "Across your portfolio" : "No finished work yet",
            icon: CheckCircle2,
        },
        {
            label: "Avg. task match",
            value: openTasks.length > 0 ? String(avgMatch) : "—",
            delta: openTasks.length > 0 ? "Based on your skills" : "No open tasks to match",
            icon: Sparkles,
        },
    ];

    const earningsTrend = useMemo(() => {
        const months = [];
        const now = new Date();
        for (let i = 8; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                month: date.toLocaleString("en", { month: "short" }),
                earnings: 0,
                key: `${date.getFullYear()}-${date.getMonth()}`,
            });
        }
        for (const work of works.filter((w) => w.status === "Completed")) {
            const date = new Date(work.lastUpdatedAt);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const bucket = months.find((m) => m.key === key);
            if (bucket) bucket.earnings += parseBudget(work.payment);
        }
        for (const task of tasks.filter((t) => t.status === "Completed" && t.paymentStatus === "Paid")) {
            const date = new Date(task.createdAt);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const bucket = months.find((m) => m.key === key);
            if (bucket) bucket.earnings += parseBudget(task.budget);
        }
        return months.map(({ month, earnings }) => ({ month, earnings }));
    }, [works, tasks]);

    const projectStatus = useMemo(() => [
        { name: "Active", value: works.filter((w) => w.status === "Active").length },
        { name: "In Review", value: works.filter((w) => w.status === "In Review").length },
        { name: "Completed", value: works.filter((w) => w.status === "Completed").length + tasks.filter((t) => t.status === "Completed").length },
        { name: "Open", value: myPostedTasks.filter((t) => t.status === "Open").length },
    ], [works, tasks, myPostedTasks]);

    const earningsGrowth = useMemo(() => {
        const values = earningsTrend.map((m) => m.earnings);
        const first = values.find((v) => v > 0) ?? 0;
        const last = values[values.length - 1] ?? 0;
        if (first === 0) return null;
        return Math.round(((last - first) / first) * 100);
    }, [earningsTrend]);

    const hasEarnings = earningsTrend.some((m) => m.earnings > 0);
    const hasProjectStatus = projectStatus.some((s) => s.value > 0);

    return (
        <div className="space-y-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Welcome back</p>
                    <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
                        {getGreeting()}, {firstName}.
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                        Your live workspace — projects, earnings, and open tasks from your account.
                    </p>
                </div>
                <Button asChild className="h-10 rounded-md px-5">
                    <Link href="/tasks/create">
                        Create task <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </header>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label} className="border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                                    <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
                                </div>
                                <div className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-foreground">
                                    <s.icon className="h-4 w-4" strokeWidth={1.75} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="border-border bg-card lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-base font-semibold">Earnings trend</CardTitle>
                            <CardDescription className="text-xs">Completed work — last 9 months</CardDescription>
                        </div>
                        {earningsGrowth !== null && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <TrendingUp className="h-3.5 w-3.5" /> {earningsGrowth > 0 ? "+" : ""}{earningsGrowth}%
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="h-[280px] pt-2">
                        {hasEarnings ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={earningsTrend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{
                                        background: "var(--color-card)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 8,
                                        fontSize: 12,
                                    }} />
                                    <Line type="monotone" dataKey="earnings" stroke="var(--color-foreground)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-foreground)" }} activeDot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Complete work to see earnings over time.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Project status</CardTitle>
                        <CardDescription className="text-xs">Your tasks and collaborations</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[280px] pt-2">
                        {hasProjectStatus ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectStatus} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip contentStyle={{
                                        background: "var(--color-card)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 8,
                                        fontSize: 12,
                                    }} />
                                    <Bar dataKey="value" fill="var(--color-foreground)" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Post or accept tasks to see status breakdown.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section>
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Open tasks for you</h2>
                        <p className="text-sm text-muted-foreground">
                            Live from Explore — tasks posted by other users.
                        </p>
                    </div>
                    <Link href="/explore" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                        View all
                    </Link>
                </div>
                {featured.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {featured.map((task) => (
                            <TaskCard key={task.id} task={task} showApply />
                        ))}
                    </div>
                ) : (
                    <Card className="border-border bg-card p-8 text-center text-sm text-muted-foreground">
                        No open tasks match your explore feed yet. Check back when others post work.
                    </Card>
                )}
            </section>
        </div>
    );
}
