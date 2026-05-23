"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/tasks/PageHeader";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { TASK_CATEGORIES } from "@/lib/dummy-data";
import { useTaskStore } from "@/lib/task-store";
function parseBudget(budget) {
    const n = parseInt(budget.replace(/[^0-9]/g, ""), 10);
    return Number.isNaN(n) ? 0 : n;
}
export function ExploreView() {
    const { tasks } = useTaskStore();
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [budget, setBudget] = useState("any");
    const openTasks = useMemo(() => tasks.filter((t) => t.status === "Open"), [tasks]);
    const filtered = useMemo(() => {
        let list = openTasks;
        const q = query.toLowerCase().trim();
        if (q) {
            list = list.filter((t) => t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.skills.some((s) => s.toLowerCase().includes(q)));
        }
        if (category !== "all")
            list = list.filter((t) => t.category === category);
        if (budget === "1k")
            list = list.filter((t) => parseBudget(t.budget) < 3000);
        if (budget === "3k") {
            list = list.filter((t) => {
                const b = parseBudget(t.budget);
                return b >= 3000 && b < 6000;
            });
        }
        if (budget === "6k")
            list = list.filter((t) => parseBudget(t.budget) >= 6000);
        return list;
    }, [openTasks, query, category, budget]);
    return (<div className="space-y-8">
      <PageHeader eyebrow="Explore tasks" title="Find your next project" description="Browse open opportunities ranked by relevance — including tasks posted in real time."/>

      <Card className="border-border bg-card">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects, skills, clients…" className="h-10 border-border bg-background pl-9 text-sm"/>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="h-10 w-[140px] border-border bg-background text-sm">
                <SelectValue placeholder="Budget"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any budget</SelectItem>
                <SelectItem value="1k">$1k – $3k</SelectItem>
                <SelectItem value="3k">$3k – $6k</SelectItem>
                <SelectItem value="6k">$6k+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 w-[160px] border-border bg-background text-sm">
                <SelectValue placeholder="Category"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {TASK_CATEGORIES.map((c) => (<SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="secondary" className="h-10 gap-2">
              <SlidersHorizontal className="h-4 w-4"/> Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (<Card className="border-border bg-card py-20 text-center">
          <p className="text-sm text-muted-foreground">No open tasks match your filters.</p>
        </Card>) : (<section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((task) => (<TaskCard key={task.id} task={task} showApply/>))}
        </section>)}
    </div>);
}
