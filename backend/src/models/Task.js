import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    budget: { type: String, required: true },
    deadline: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    category: { type: String, required: true },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Completed"],
        default: "Open",
    },
    match: { type: Number, default: 80 },
    paymentStatus: {
        type: String,
        enum: ["Unpaid", "Partial", "Paid"],
        default: "Unpaid",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    lastActivity: { type: String, default: "" },
    lastActivityAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
