import { z } from "zod";
import connectDB from "../db/connect.js";
import User from "../models/User.js";
import { applyToTask, updateApplicationStatus } from "../services/applicationService.js";
import { canActAsFreelancer } from "../middleware/auth.js";

const applySchema = z.object({
    taskId: z.string().min(1),
    coverLetter: z.string().min(10),
    proposedRate: z.string().optional(),
});

const statusSchema = z.object({
    status: z.enum(["Pending", "Accepted", "Rejected"]),
});

export async function apply(req, res) {
    await connectDB();
    const user = await User.findById(req.user.id);
    if (!canActAsFreelancer(user)) {
        return res.status(403).json({ success: false, error: "Your account cannot apply to tasks" });
    }
    const parsed = applySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message });
    }
    const application = await applyToTask(
        parsed.data.taskId,
        req.user.id,
        parsed.data.coverLetter,
        parsed.data.proposedRate ?? ""
    );
    return res.status(201).json({ success: true, data: { application } });
}

export async function updateStatus(req, res) {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message });
    }
    const application = await updateApplicationStatus(req.params.id, req.user.id, parsed.data.status);
    return res.json({ success: true, data: { application } });
}
