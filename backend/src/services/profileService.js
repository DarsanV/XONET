import connectDB from "../db/connect.js";
import User from "../models/User.js";
import { serializeProfile } from "../utils/serializers.js";
import { notifyProfileUpdated } from "./notificationTriggers.js";

export async function updateProfile(userId, updates) {
    await connectDB();
    const allowed = [
        "fullName", "headline", "bio", "location", "hourlyRate", "available",
        "skills", "experience", "links", "resume",
    ];
    const patch = {};
    for (const key of allowed) {
        if (updates[key] !== undefined) {
            patch[key] = updates[key];
        }
    }
    const user = await User.findByIdAndUpdate(userId, patch, { new: true }).lean();
    await notifyProfileUpdated({ userId });
    return serializeProfile(user);
}

