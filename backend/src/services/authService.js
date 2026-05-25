import bcrypt from "bcryptjs";
import connectDB from "../db/connect.js";
import User from "../models/User.js";
import { serializeUser } from "../utils/serializers.js";

const SALT_ROUNDS = 12;

export async function registerUser({ fullName, email, password, role }) {
    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
        const err = new Error("An account with this email already exists");
        err.status = 409;
        throw err;
    }
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashed,
        role,
        headline: "",
        skills: [],
        experience: [],
    });
    return serializeUser(user);
}

export async function getUserById(userId) {
    await connectDB();
    const user = await User.findById(userId);
    return serializeUser(user);
}

