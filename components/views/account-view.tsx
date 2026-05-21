"use client";

import { useCallback, useState } from "react";
import {
  Github,
  Linkedin,
  Globe,
  Upload,
  FileText,
  Eye,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SkillsEditor } from "@/components/profile/skills-editor";
import { ExperienceEditor } from "@/components/profile/experience-editor";
import { useProfileStore } from "@/lib/profile-store";
import type { ExperienceEntry, UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function cloneProfile(p: UserProfile): UserProfile {
  return structuredClone(p);
}

export function AccountView() {
  const { profile, updateProfile } = useProfileStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(profile);

  const data = editing ? draft : profile;

  const startEditing = useCallback(() => {
    setDraft(cloneProfile(profile));
    setEditing(true);
  }, [profile]);

  const cancelEditing = useCallback(() => {
    setDraft(cloneProfile(profile));
    setEditing(false);
  }, [profile]);

  const saveChanges = useCallback(() => {
    updateProfile({
      fullName: draft.fullName.trim(),
      headline: draft.headline.trim(),
      email: draft.email.trim(),
      location: draft.location.trim(),
      hourlyRate: draft.hourlyRate.trim(),
      available: draft.available,
      bio: draft.bio.trim(),
      skills: draft.skills,
      experience: draft.experience,
      links: {
        github: draft.links.github.trim(),
        linkedin: draft.links.linkedin.trim(),
        portfolio: draft.links.portfolio.trim(),
      },
    });
    setEditing(false);
    toast.success("Profile saved", {
      description: "Your changes are live across XONET.",
    });
  }, [draft, updateProfile]);

  const patchDraft = useCallback((updates: Partial<UserProfile>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const patchLinks = useCallback(
    (key: keyof UserProfile["links"], value: string) => {
      setDraft((prev) => ({
        ...prev,
        links: { ...prev.links, [key]: value },
      }));
    },
    [],
  );

  const draftAddSkill = useCallback((skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    setDraft((prev) =>
      prev.skills.includes(trimmed)
        ? prev
        : { ...prev, skills: [...prev.skills, trimmed] },
    );
  }, []);

  const draftRemoveSkill = useCallback((skill: string) => {
    setDraft((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  }, []);

  const draftAddExperience = useCallback((entry: Omit<ExperienceEntry, "id">) => {
    const id = `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setDraft((prev) => ({
      ...prev,
      experience: [{ ...entry, id }, ...prev.experience],
    }));
  }, []);

  const draftUpdateExperience = useCallback(
    (id: string, updates: Partial<ExperienceEntry>) => {
      setDraft((prev) => ({
        ...prev,
        experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      }));
    },
    [],
  );

  const draftDeleteExperience = useCallback((id: string) => {
    setDraft((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Profile</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Your profile</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Keep your information current — it powers how clients and our AI match you to
            opportunities.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <Button
                type="button"
                variant="secondary"
                className="h-10 gap-2 rounded-md px-5 transition-all duration-200"
                onClick={cancelEditing}
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button
                type="button"
                className="h-10 gap-2 rounded-md px-5 transition-all duration-200"
                onClick={saveChanges}
              >
                <Check className="h-4 w-4" /> Save changes
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="h-10 gap-2 rounded-md px-5 transition-all duration-200"
              onClick={startEditing}
            >
              <Pencil className="h-4 w-4" /> Edit profile
            </Button>
          )}
        </div>
      </header>

      {editing && (
        <div className="rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent animate-in fade-in slide-in-from-top-1 duration-300">
          You&apos;re editing your profile. Save or cancel to exit edit mode.
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-6 transition-opacity duration-300 lg:grid-cols-3",
          editing && "opacity-100",
        )}
      >
        <Card
          className={cn(
            "border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] transition-shadow duration-300 lg:col-span-2",
            editing && "ring-1 ring-foreground/10",
          )}
        >
          <CardHeader>
            <CardTitle className="text-base">Profile details</CardTitle>
            <CardDescription>Public information shown to potential clients.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ProfileField
              label="Full name"
              value={data.fullName}
              editing={editing}
              onChange={(v) => patchDraft({ fullName: v })}
            />
            <ProfileField
              label="Headline"
              value={data.headline}
              editing={editing}
              onChange={(v) => patchDraft({ headline: v })}
            />
            <ProfileField
              label="Email"
              type="email"
              value={data.email}
              editing={editing}
              onChange={(v) => patchDraft({ email: v })}
            />
            <ProfileField
              label="Location"
              value={data.location}
              editing={editing}
              onChange={(v) => patchDraft({ location: v })}
            />
            <ProfileField
              label="Hourly rate (USD)"
              value={data.hourlyRate}
              editing={editing}
              onChange={(v) => patchDraft({ hourlyRate: v })}
            />
            <div className="flex items-center justify-between rounded-md border border-border bg-background px-4 md:col-span-2">
              <div>
                <p className="text-sm font-medium">Available for work</p>
                <p className="text-xs text-muted-foreground">Show as open to new projects.</p>
              </div>
              <Switch
                checked={data.available}
                disabled={!editing}
                onCheckedChange={(available) => patchDraft({ available })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bio</Label>
              {editing ? (
                <Textarea
                  value={data.bio}
                  onChange={(e) => patchDraft({ bio: e.target.value })}
                  className="min-h-[120px] resize-none border-border bg-background transition-colors duration-200"
                />
              ) : (
                <p className="rounded-md border border-border bg-background/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  {data.bio}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]">
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
                  <p className="truncate text-sm font-medium">{data.resume.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {data.resume.updatedAt} · {data.resume.size}
                  </p>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8" disabled={editing}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="secondary" className="w-full gap-2" disabled={!editing}>
                <Upload className="h-4 w-4" /> Upload new resume
              </Button>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] transition-shadow duration-300",
              editing && "ring-1 ring-foreground/10",
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">Professional links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <LinkField
                icon={Github}
                label="GitHub"
                value={data.links.github}
                editing={editing}
                placeholder="github.com/username"
                onChange={(v) => patchLinks("github", v)}
              />
              <LinkField
                icon={Linkedin}
                label="LinkedIn"
                value={data.links.linkedin}
                editing={editing}
                placeholder="linkedin.com/in/username"
                onChange={(v) => patchLinks("linkedin", v)}
              />
              <LinkField
                icon={Globe}
                label="Portfolio"
                value={data.links.portfolio}
                editing={editing}
                placeholder="yoursite.dev"
                onChange={(v) => patchLinks("portfolio", v)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card
        className={cn(
          "border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] transition-shadow duration-300",
          editing && "ring-1 ring-foreground/10",
        )}
      >
        <CardHeader>
          <CardTitle className="text-base">Skills</CardTitle>
          <CardDescription>Used by our AI to surface high-fit projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <SkillsEditor
            skills={data.skills}
            editing={editing}
            onAdd={editing ? draftAddSkill : () => {}}
            onRemove={editing ? draftRemoveSkill : () => {}}
          />
        </CardContent>
      </Card>

      <Card
        className={cn(
          "border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] transition-shadow duration-300",
          editing && "ring-1 ring-foreground/10",
        )}
      >
        <CardHeader>
          <CardTitle className="text-base">Experience</CardTitle>
          <CardDescription>Your professional history and impact.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExperienceEditor
            experience={data.experience}
            editing={editing}
            onAdd={editing ? draftAddExperience : () => {}}
            onUpdate={editing ? draftUpdateExperience : () => {}}
            onDelete={editing ? draftDeleteExperience : () => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileField({
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {editing ? (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 border-border bg-background text-sm transition-colors duration-200"
        />
      ) : (
        <p className="flex h-10 items-center rounded-md border border-transparent px-1 text-sm">
          {value || "—"}
        </p>
      )}
    </div>
  );
}

function LinkField({
  icon: Icon,
  label,
  value,
  editing,
  placeholder,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  editing: boolean;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  if (!editing) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-2">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm text-muted-foreground">
          {value || "Not set"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 transition-colors duration-200 focus-within:ring-1 focus-within:ring-ring">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-10 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
      />
    </div>
  );
}
