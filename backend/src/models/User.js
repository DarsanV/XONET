import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, default: "" },
    description: { type: String, default: "" },
}, { _id: true });

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ["freelancer", "client", "both"],
        required: true,
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },
    passwordResetTokenHash: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
    lastLoginAt: { type: Date, default: null },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    hourlyRate: { type: String, default: "" },
    available: { type: Boolean, default: true },
    skills: { type: [String], default: [] },
    experience: { type: [experienceSchema], default: [] },
    links: {
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        portfolio: { type: String, default: "" },
    },
    resume: {
        fileName: { type: String, default: "" },
        updatedAt: { type: String, default: "" },
        size: { type: String, default: "" },
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
