"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SkillsEditorProps = {
  skills: string[];
  editing: boolean;
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
};

export function SkillsEditor({ skills, editing, onAdd, onRemove }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState("");

  function handleAdd() {
    if (!newSkill.trim()) return;
    onAdd(newSkill);
    setNewSkill("");
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-wrap gap-2 transition-opacity duration-200",
          editing ? "opacity-100" : "opacity-95",
        )}
      >
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className={cn(
              "rounded-sm bg-secondary px-3 py-1 text-xs font-normal transition-all duration-200",
              editing && "pr-1.5",
            )}
          >
            {skill}
            {editing && (
              <button
                type="button"
                onClick={() => onRemove(skill)}
                className="ml-1.5 inline-flex rounded-sm p-0.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground">No skills added yet.</p>
        )}
      </div>

      {editing && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
            placeholder="e.g. React, Figma, Python"
            className="h-9 flex-1 border-border bg-background text-sm"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-9 gap-1 rounded-md px-3"
            onClick={handleAdd}
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      )}
    </div>
  );
}
