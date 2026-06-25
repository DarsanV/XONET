import mongoose from "mongoose";

export const NOTIFICATION_TYPES = [
    "application_received",
    "task_assigned",
    "task_status_changed",
    "progress_updated",
    "payment_status_changed",
    "deadline_approaching",
    "task_completed",
    "profile_updated",
];

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
    taskTitle: { type: String, default: "" },
    href: { type: String, default: "/" },
    read: { type: Boolean, default: false, index: true },
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
