import { verifyToken } from "../utils/jwt.js";
import connectDB from "../db/connect.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
        if (!token) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const decoded = verifyToken(token);
        await connectDB();
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };
        next();
    }
    catch {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }
}

export function canActAsClient(user) {
    return user.role === "client" || user.role === "both";
}

export function canActAsFreelancer(user) {
    return user.role === "freelancer" || user.role === "both";
}
