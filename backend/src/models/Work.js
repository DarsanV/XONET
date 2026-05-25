import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true, unique: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: String, required: true },
    client: { type: String, default: "Client" },
    status: {
        type: String,
        enum: ["Active", "In Review", "Completed"],
        default: "Active",
    },
    payment: { type: String, default: "" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    deadline: { type: String, default: "" },
    lastUpdatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Work || mongoose.model("Work", workSchema);
