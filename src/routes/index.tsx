import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
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
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { earningsTrend, projectStatus, recommendedJobs } from "@/lib/dummy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — XONET" },
      { name: "description", content: "Overview of your projects, earnings and AI-recommended work." },
    ],
  }),
  component: () => (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ),
});

const stats = [
  { label: "Active Projects", value: "8", delta: "+2 this week", icon: Briefcase },
  { label: "Earnings this month", value: "$8,240", delta: "+18.2%", icon: DollarSign },
  { label: "Completion Rate", value: "98%", delta: "+1.4%", icon: CheckCircle2 },
  { label: "AI Match Score", value: "92", delta: "Excellent", icon: Sparkles },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Welcome back</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Good evening, Alex.</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Here's a quiet look at where your work stands today — projects, earnings, and the
            opportunities our AI thinks fit you best.
          </p>
        </div>
        <Button className="h-10 rounded-md px-5">
          New proposal <ArrowUpRight className="ml-1 h-4 w-4" />
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
              <CardDescription className="text-xs">Last 9 months</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> +24.6%
            </div>
          </CardHeader>
          <CardContent className="h-[280px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsTrend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="var(--color-foreground)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-foreground)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Project status</CardTitle>
            <CardDescription className="text-xs">Current portfolio breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatus} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="var(--color-foreground)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">AI recommended for you</h2>
            <p className="text-sm text-muted-foreground">Curated from your skills, history and rate.</p>
          </div>
          <Link to="/explore" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendedJobs.map((job) => (
            <Card key={job.id} className="group border-border bg-card transition-colors hover:border-foreground/30">
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="rounded-sm bg-secondary text-[10px] font-medium tracking-wide text-foreground">
                    {job.match}% match
                  </Badge>
                  <span className="text-xs text-muted-foreground">{job.deadline}</span>
                </div>
                <h3 className="mt-4 text-[15px] font-semibold leading-snug">{job.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{job.client}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.tags.map((t) => (
                    <span key={t} className="rounded-sm border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-semibold">{job.budget}</span>
                  <Button size="sm" variant="secondary" className="h-8 rounded-md">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
