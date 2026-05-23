"use client";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
const emptyEntry = () => ({
    role: "",
    company: "",
    duration: "",
    description: "",
});
export function ExperienceEditor({ experience, editing, onAdd, onUpdate, onDelete, }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyEntry());
    function openAdd() {
        setEditingId(null);
        setForm(emptyEntry());
        setDialogOpen(true);
    }
    function openEdit(entry) {
        setEditingId(entry.id);
        setForm({
            role: entry.role,
            company: entry.company,
            duration: entry.duration,
            description: entry.description,
        });
        setDialogOpen(true);
    }
    function handleSave() {
        if (!form.role.trim() || !form.company.trim())
            return;
        if (editingId) {
            onUpdate(editingId, form);
        }
        else {
            onAdd(form);
        }
        setDialogOpen(false);
    }
    return (<>
      <div className="space-y-4">
        {experience.map((entry, index) => (<div key={entry.id} className={cn("rounded-md border border-border bg-background/50 p-4 transition-all duration-200", editing && "hover:border-foreground/20")} style={{ animationDelay: `${index * 40}ms` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{entry.role}</p>
                <p className="text-xs text-muted-foreground">{entry.company}</p>
                {entry.description && (<p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {entry.description}
                  </p>)}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-xs text-muted-foreground">{entry.duration}</span>
                {editing && (<div className="flex gap-1">
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(entry)}>
                      <Pencil className="h-3 w-3"/>
                    </Button>
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(entry.id)}>
                      <Trash2 className="h-3 w-3"/>
                    </Button>
                  </div>)}
              </div>
            </div>
          </div>))}

        {experience.length === 0 && (<p className="py-6 text-center text-sm text-muted-foreground">
            No experience entries yet.
          </p>)}

        {editing && (<Button type="button" variant="secondary" className="h-9 w-full gap-2 rounded-md animate-in fade-in duration-200" onClick={openAdd}>
            <Plus className="h-4 w-4"/> Add experience
          </Button>)}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit experience" : "Add experience"}</DialogTitle>
            <DialogDescription>Role, company, and timeline visible to clients.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Role</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="h-10 border-border bg-background text-sm"/>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Company
              </Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="h-10 border-border bg-background text-sm"/>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Duration
              </Label>
              <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2023 — Present" className="h-10 border-border bg-background text-sm"/>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Description
              </Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[80px] resize-none border-border bg-background"/>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              {editingId ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>);
}
