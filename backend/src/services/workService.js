import connectDB from "../db/connect.js";
import Work from "../models/Work.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { serializeWork } from "../utils/serializers.js";

export async function updateWorkProgress(workId, freelancerId, progress) {
    await connectDB();
    const work = await Work.findById(workId);
    if (!work) {
        const err = new Error("Work not found");
        err.status = 404;
        throw err;
    }
    if (work.freelancer.toString() !== freelancerId.toString()) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
    }
    const clamped = Math.min(100, Math.max(0, progress));
    work.progress = clamped;
    work.status = clamped >= 100 ? "Completed" : clamped >= 90 ? "In Review" : "Active";
    work.lastUpdatedAt = new Date();
    await work.save();

    const task = await Task.findById(work.task);
    const freelancer = await User.findById(freelancerId);
    if (task) {
        task.progress = clamped;
        task.status = clamped >= 100 ? "Completed" : clamped > 0 ? "In Progress" : task.status;
        task.paymentStatus = clamped >= 100 ? "Paid" : clamped > 0 ? "Partial" : task.paymentStatus;
        task.lastActivity = `${freelancer?.fullName ?? "Freelancer"} updated progress to ${clamped}%`;
        task.lastActivityAt = new Date();
        await task.save();
    }

    return serializeWork(work);
}

