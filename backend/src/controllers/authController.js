import bcrypt from "bcryptjs";
import { z } from "zod";
import connectDB from "../db/connect.js";
import User from "../models/User.js";
import { registerUser } from "../services/authService.js";
import { signToken } from "../utils/jwt.js";

const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["freelancer", "client", "both"]),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message });
    }
    const user = await registerUser(parsed.data);
    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    return res.status(201).json({ success: true, data: { user, token } });
}

export async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: "Invalid credentials" });
    }
    const email = parsed.data.email.toLowerCase().trim();
    const password = parsed.data.password;
    await connectDB();
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ success: false, error: "Invalid email or password" });
    }
    const token = signToken({
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
    });
    return res.json({
        success: true,
        data: {
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.fullName,
                role: user.role,
            },
        },
    });
}
