export function SkillTags({ skills, max = 4 }) {
    const visible = skills.slice(0, max);
    const extra = skills.length - max;
    return (<div className="flex flex-wrap gap-1.5">
      {visible.map((skill) => (<span key={skill} className="rounded-sm border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          {skill}
        </span>))}
      {extra > 0 && (<span className="rounded-sm border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          +{extra}
        </span>)}
    </div>);
}
