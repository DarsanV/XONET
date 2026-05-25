import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true, index: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    coverLetter: { type: String, required: true },
    proposedRate: { type: String, default: "" },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

applicationSchema.index({ task: 1, freelancer: 1 }, { unique: true });

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
