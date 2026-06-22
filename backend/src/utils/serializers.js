function id(doc) {
    if (!doc)
        return null;
    if (typeof doc === "string")
        return doc;
    return doc._id?.toString?.() ?? doc.toString();
}

export function computeSkillMatch(userSkills = [], targetSkills = []) {
    if (!targetSkills.length) return 0;
    if (!userSkills.length) return 0;
    const normalizedUser = userSkills.map((s) => s.toLowerCase());
    const overlap = targetSkills.filter((skill) => normalizedUser.includes(skill.toLowerCase())).length;
    return Math.round((overlap / targetSkills.length) * 100);
}

export function serializeUser(user) {
    if (!user)
        return null;
    const u = user.toObject ? user.toObject() : user;
    return {
        id: id(u._id),
        fullName: u.fullName,
        name: u.fullName,
        email: u.email,
        role: u.role,
        headline: u.headline ?? "",
        bio: u.bio ?? "",
        location: u.location ?? "",
        hourlyRate: u.hourlyRate ?? "",
        available: u.available ?? true,
        skills: u.skills ?? [],
        experience: (u.experience ?? []).map((e) => ({
            id: id(e._id),
            role: e.role,
            company: e.company,
            duration: e.duration ?? "",
            description: e.description ?? "",
        })),
        links: u.links ?? { github: "", linkedin: "", portfolio: "" },
        resume: u.resume ?? { fileName: "", updatedAt: "", size: "" },
        rate: u.hourlyRate ? (u.hourlyRate.startsWith("$") ? u.hourlyRate : `$${u.hourlyRate}/hr`) : "",
    };
}

export function serializeProfile(user) {
    const u = serializeUser(user);
    if (!u)
        return null;
    return {
        fullName: u.fullName,
        headline: u.headline,
        email: u.email,
        location: u.location,
        hourlyRate: u.hourlyRate,
        available: u.available,
        bio: u.bio,
        skills: u.skills,
        experience: u.experience,
        links: u.links,
        resume: u.resume,
    };
}

export function serializeFreelancer(user, match = 0) {
    const u = serializeUser(user);
    if (!u)
        return null;
    return {
        id: u.id,
        name: u.fullName,
        headline: u.headline,
        location: u.location,
        skills: u.skills,
        rate: u.rate || "$—/hr",
        match,
        available: u.available,
    };
}

export function serializeTask(task) {
    if (!task)
        return null;
    const t = task.toObject ? task.toObject() : task;
    const creator = t.creator?._id ? t.creator : t.creator;
    const assigned = t.assignedFreelancer?._id ? t.assignedFreelancer : t.assignedFreelancer;
    return {
        id: id(t._id),
        creatorId: id(creator),
        title: t.title,
        description: t.description,
        skills: t.skills ?? [],
        budget: t.budget,
        deadline: t.deadline,
        experienceLevel: t.experienceLevel,
        category: t.category,
        status: t.status,
        match: t.match ?? 0,
        paymentStatus: t.paymentStatus,
        progress: t.progress ?? 0,
        assignedFreelancerId: assigned ? id(assigned) : undefined,
        lastActivity: t.lastActivity ?? "",
        lastActivityAt: t.lastActivityAt?.toISOString?.() ?? t.lastActivityAt ?? null,
        createdAt: t.createdAt?.toISOString?.() ?? new Date().toISOString(),
    };
}

export function serializeApplication(app) {
    if (!app)
        return null;
    const a = app.toObject ? app.toObject() : app;
    return {
        id: id(a._id),
        taskId: id(a.task?._id ?? a.task),
        freelancerId: id(a.freelancer?._id ?? a.freelancer),
        coverLetter: a.coverLetter,
        proposedRate: a.proposedRate ?? "",
        status: a.status,
        appliedAt: a.appliedAt?.toISOString?.() ?? new Date().toISOString(),
    };
}

export function serializeWork(work) {
    if (!work)
        return null;
    const w = work.toObject ? work.toObject() : work;
    return {
        id: id(w._id),
        taskId: id(w.task?._id ?? w.task),
        freelancerId: id(w.freelancer?._id ?? w.freelancer),
        project: w.project,
        client: w.client,
        status: w.status,
        payment: w.payment,
        progress: w.progress ?? 0,
        deadline: w.deadline,
        lastUpdatedAt: w.lastUpdatedAt?.toISOString?.() ?? new Date().toISOString(),
    };
}

export function serializeMessage(msg) {
    if (!msg)
        return null;
    const m = msg.toObject ? msg.toObject() : msg;
    return {
        id: id(m._id),
        taskId: id(m.task?._id ?? m.task),
        sender: m.senderRole,
        senderId: id(m.sender?._id ?? m.sender),
        text: m.text,
        type: m.type ?? "text",
        sentAt: m.sentAt?.toISOString?.() ?? new Date().toISOString(),
    };
}
