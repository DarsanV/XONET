import { z } from "zod";
import { updateWorkProgress } from "../services/workService.js";

const schema = z.object({ progress: z.number().min(0).max(100) });

export async function updateProgress(req, res) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message });
    }
    const work = await updateWorkProgress(req.params.id, req.user.id, parsed.data.progress);
    return res.json({ success: true, data: { work } });
}
