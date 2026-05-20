import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Globe, Upload, FileText, Eye } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — XONET" },
      { name: "description", content: "Manage your profile, resume and professional links." },
    ],
  }),
  component: () => (
    <AppLayout>
      <Account />
    </AppLayout>
  ),
});

const skills = ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL", "Figma", "Next.js", "AI / LLMs"];

function Account() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Account</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Your profile</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Keep your information current — it powers how clients and our AI match you to opportunities.
          </p>
        </div>
        <Button className="h-10 px-5">Save changes</Button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Profile details</CardTitle>
            <CardDescription>Public information shown to potential clients.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Full name" defaultValue="Alex Mercer" />
            <Field label="Headline" defaultValue="Senior Full-Stack Engineer" />
            <Field label="Email" type="email" defaultValue="alex@xonet.io" />
            <Field label="Location" defaultValue="Lisbon, Portugal" />
            <Field label="Hourly rate (USD)" defaultValue="95" />
            <div className="flex items-center justify-between rounded-md border border-border bg-background px-4">
              <div>
                <p className="text-sm font-medium">Available for work</p>
                <p className="text-xs text-muted-foreground">Show as open to new projects.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bio</Label>
              <Textarea
                defaultValue="Senior engineer with 9+ years building polished web products for startups and growth-stage teams. I care about craft, performance, and shipping things people actually use."
                className="min-h-[120px] resize-none border-border bg-background"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Resume</CardTitle>
              <CardDescription>PDF, up to 5MB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-secondary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">alex-mercer-resume.pdf</p>
                  <p className="text-xs text-muted-foreground">Updated 3 days ago · 412 KB</p>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="secondary" className="w-full gap-2">
                <Upload className="h-4 w-4" /> Upload new resume
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Professional links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <LinkField icon={Github} placeholder="github.com/alex" defaultValue="github.com/alexmercer" />
              <LinkField icon={Linkedin} placeholder="linkedin.com/in/alex" defaultValue="linkedin.com/in/alexmercer" />
              <LinkField icon={Globe} placeholder="portfolio.dev" defaultValue="alexmercer.dev" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Skills & experience</CardTitle>
          <CardDescription>Used by our AI to surface high-fit projects.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge key={s} variant="secondary" className="rounded-sm bg-secondary px-3 py-1 text-xs font-normal">
                {s}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="h-7 rounded-sm text-xs text-muted-foreground">
              + Add skill
            </Button>
          </div>
          <Separator />
          <div className="space-y-4">
            {[
              { role: "Senior Engineer", co: "Helios Labs", period: "2023 — Present" },
              { role: "Front-end Lead", co: "Layerframe", period: "2020 — 2023" },
              { role: "Full-stack Developer", co: "Quill & Co.", period: "2017 — 2020" },
            ].map((e) => (
              <div key={e.role} className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{e.role}</p>
                  <p className="text-xs text-muted-foreground">{e.co}</p>
                </div>
                <span className="text-xs text-muted-foreground">{e.period}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<"input">) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input {...props} className="h-10 border-border bg-background text-sm" />
    </div>
  );
}

function LinkField({
  icon: Icon,
  ...props
}: { icon: React.ComponentType<{ className?: string }> } & React.ComponentProps<"input">) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <Input {...props} className="h-10 border-0 bg-transparent px-0 text-sm focus-visible:ring-0" />
    </div>
  );
}
