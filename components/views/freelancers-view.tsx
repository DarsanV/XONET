"use client";

import { useMemo, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { PageHeader } from "@/components/tasks/PageHeader";
import { SkillTags } from "@/components/tasks/SkillTags";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/lib/task-store";

export function FreelancersView() {
  const { freelancers } = useTaskStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return freelancers;
    return freelancers.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.headline.toLowerCase().includes(q) ||
        f.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }, [freelancers, query]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Freelancers"
        title="Talent directory"
        description="Discover specialists ranked by fit score, availability, and skill overlap with your open tasks."
      />

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, skill, or headline…"
            className="h-10 border-border bg-background text-sm"
          />
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((f) => (
          <Card
            key={f.id}
            className="border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] transition-colors hover:border-foreground/30"
          >
            <CardContent className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-secondary text-sm font-semibold">
                  {f.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-sm bg-secondary text-[10px] tracking-wide"
                >
                  {f.match}% match
                </Badge>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold">{f.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.headline}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {f.location}
              </p>
              <div className="mt-4">
                <SkillTags skills={f.skills} />
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Rate</p>
                  <p className="text-sm font-semibold">{f.rate}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    className={
                      f.available
                        ? "rounded-sm bg-foreground/10 text-foreground"
                        : "rounded-sm bg-secondary text-muted-foreground"
                    }
                  >
                    {f.available ? "Available" : "Booked"}
                  </Badge>
                  <Button size="sm" variant="secondary" className="h-8 gap-1 rounded-md text-xs">
                    <Star className="h-3 w-3" /> View profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
