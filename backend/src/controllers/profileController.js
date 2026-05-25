import { updateProfile } from "../services/profileService.js";

export async function update(req, res) {
    const profile = await updateProfile(req.user.id, req.body);
    return res.json({ success: true, data: { profile } });
}
