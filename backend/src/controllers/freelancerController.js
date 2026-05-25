import connectDB from "../db/connect.js";
import User from "../models/User.js";
import { serializeFreelancer } from "../utils/serializers.js";

export async function list(req, res) {
    await connectDB();
    const freelancers = await User.find({
        _id: { $ne: req.user.id },
        role: { $in: ["freelancer", "both"] },
    }).lean();
    return res.json({ success: true, data: { freelancers: freelancers.map(serializeFreelancer) } });
}
