"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPERIENCE_LEVELS, TASK_CATEGORIES } from "@/lib/dummy-data";
import type { CreateTaskInput, ExperienceLevel, Task } from "@/lib/types";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  skills: z.string().min(1, "Add at least one skill"),
  budget: z.string().min(1, "Budget is required"),
  deadline: z.string().min(1, "Deadline is required"),
  experienceLevel: z.enum(["Entry", "Intermediate", "Senior", "Expert"]),
  category: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof schema>;

type TaskFormProps = {
  defaultValues?: Partial<Task>;
  submitLabel?: string;
  onSubmit: (data: CreateTaskInput) => void;
  onCancel?: () => void;
};

export function TaskForm({
  defaultValues,
  submitLabel = "Create task",
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      skills: defaultValues?.skills?.join(", ") ?? "",
      budget: defaultValues?.budget ?? "",
      deadline: defaultValues?.deadline ?? "",
      experienceLevel: defaultValues?.experienceLevel ?? "Intermediate",
      category: defaultValues?.category ?? "Engineering",
    },
  });

  const experienceLevel = watch("experienceLevel");
  const category = watch("category");

  function submit(values: FormValues) {
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      skills: values.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      budget: values.budget.trim(),
      deadline: values.deadline.trim(),
      experienceLevel: values.experienceLevel as ExperienceLevel,
      category: values.category,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Project title" error={errors.title?.message}>
          <Input
            {...register("title")}
            placeholder="e.g. Fintech dashboard MVP"
            className="h-10 border-border bg-background text-sm"
          />
        </Field>
        <Field label="Category" error={errors.category?.message}>
          <Select value={category} onValueChange={(v) => setValue("category", v)}>
            <SelectTrigger className="h-10 border-border bg-background text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {TASK_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Description" error={errors.description?.message}>
        <Textarea
          {...register("description")}
          placeholder="Describe scope, deliverables, and expectations…"
          className="min-h-[140px] resize-none border-border bg-background"
        />
      </Field>

      <Field
        label="Skills required"
        hint="Comma-separated, e.g. React, TypeScript, Figma"
        error={errors.skills?.message}
      >
        <Input
          {...register("skills")}
          placeholder="React, Node.js, PostgreSQL"
          className="h-10 border-border bg-background text-sm"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Field label="Budget / pay" error={errors.budget?.message}>
          <Input
            {...register("budget")}
            placeholder="$4,500"
            className="h-10 border-border bg-background text-sm"
          />
        </Field>
        <Field label="Deadline" error={errors.deadline?.message}>
          <Input
            {...register("deadline")}
            placeholder="Nov 15, 2026"
            className="h-10 border-border bg-background text-sm"
          />
        </Field>
        <Field label="Experience level" error={errors.experienceLevel?.message}>
          <Select
            value={experienceLevel}
            onValueChange={(v) =>
              setValue("experienceLevel", v as FormValues["experienceLevel"])
            }
          >
            <SelectTrigger className="h-10 border-border bg-background text-sm">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit" className="h-10 px-6">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" className="h-10 px-6" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
