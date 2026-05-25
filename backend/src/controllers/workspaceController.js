import { getWorkspace } from "../services/workspaceService.js";

export async function getWorkspaceData(req, res) {
    const workspace = await getWorkspace(req.user.id);
    return res.json({ success: true, data: workspace });
}
