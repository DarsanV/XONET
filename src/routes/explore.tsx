import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exploreJobs } from "@/lib/dummy-data";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — XONET" },
      { name: "description", content: "Discover new projects matched to your skills." },
    ],
  }),
  component: () => (
    <AppLayout>
      <Explore />
    </AppLayout>
  ),
});

function Explore() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Explore</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Find your next project</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Browse opportunities ranked by relevance to your profile and recent work.
        </p>
      </header>

      <Card className="border-border bg-card">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search projects, skills, clients…" className="h-10 border-border bg-background pl-9 text-sm" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="any">
              <SelectTrigger className="h-10 w-[140px] border-border bg-background text-sm">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any budget</SelectItem>
                <SelectItem value="1k">$1k – $3k</SelectItem>
                <SelectItem value="3k">$3k – $6k</SelectItem>
                <SelectItem value="6k">$6k+</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="h-10 w-[140px] border-border bg-background text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="ai">AI & Data</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" className="h-10 gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exploreJobs.map((job) => (
          <Card key={job.id} className="group flex flex-col border-border bg-card transition-colors hover:border-foreground/30">
            <CardContent className="flex h-full flex-col p-5">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="rounded-sm bg-secondary text-[10px] tracking-wide">
                  {job.match}% match
                </Badge>
                <span className="text-xs text-muted-foreground">Due {job.deadline}</span>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold leading-snug">{job.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{job.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.tags.map((t) => (
                  <span key={t} className="rounded-sm border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Budget</p>
                  <p className="text-sm font-semibold">{job.budget}</p>
                </div>
                <Button size="sm" className="h-9 rounded-md px-4">Apply</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
