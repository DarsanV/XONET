import { z } from "zod";
import connectDB from "../db/connect.js";
import User from "../models/User.js";
import { createTask, updateTask, deleteTask } from "../services/taskService.js";
import { canActAsClient } from "../middleware/auth.js";

const createSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    skills: z.array(z.string()),
    budget: z.string().min(1),
    deadline: z.string().min(1),
    experienceLevel: z.string().min(1),
    category: z.string().min(1),
});

export async function create(req, res) {
    await connectDB();
    const user = await User.findById(req.user.id);
    if (!canActAsClient(user)) {
        return res.status(403).json({ success: false, error: "Your account cannot post tasks" });
    }
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message });
    }
    const task = await createTask(req.user.id, parsed.data);
    return res.status(201).json({ success: true, data: { task } });
}

export async function update(req, res) {
    const task = await updateTask(req.params.id, req.user.id, req.body);
    return res.json({ success: true, data: { task } });
}

export async function remove(req, res) {
    await deleteTask(req.params.id, req.user.id);
    return res.json({ success: true, data: { ok: true } });
}
