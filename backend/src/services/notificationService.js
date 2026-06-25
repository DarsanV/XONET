import connectDB from "../db/connect.js";
import Notification from "../models/Notification.js";

export function serializeNotification(doc) {
    if (!doc) return null;
    const n = doc.toObject ? doc.toObject() : doc;
    return {
        id: n._id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        taskId: n.task?.toString?.() ?? n.task ?? null,
        taskTitle: n.taskTitle ?? "",
        href: n.href ?? "/",
        read: n.read ?? false,
        createdAt: n.createdAt?.toISOString?.() ?? new Date().toISOString(),
    };
}

export async function createNotification({ userId, type, title, message, taskId = null, taskTitle = "", href = "/" }) {
    await connectDB();
    const notification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        task: taskId,
        taskTitle,
        href,
        read: false,
    });
    return serializeNotification(notification);
}

export async function listNotifications(userId, { limit = 50, unreadOnly = false } = {}) {
    await connectDB();
    const filter = { user: userId };
    if (unreadOnly) filter.read = false;
    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    return notifications.map(serializeNotification);
}

export async function getUnreadCount(userId) {
    await connectDB();
    return Notification.countDocuments({ user: userId, read: false });
}

export async function markNotificationRead(userId, notificationId) {
    await connectDB();
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { read: true },
        { new: true },
    ).lean();
    if (!notification) {
        const err = new Error("Notification not found");
        err.status = 404;
        throw err;
    }
    return serializeNotification(notification);
}

export async function markAllNotificationsRead(userId) {
    await connectDB();
    await Notification.updateMany({ user: userId, read: false }, { read: true });
    return { ok: true };
}

export async function deleteNotification(userId, notificationId) {
    await connectDB();
    const result = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
    if (!result) {
        const err = new Error("Notification not found");
        err.status = 404;
        throw err;
    }
    return { ok: true };
}

export async function deleteAllReadNotifications(userId) {
    await connectDB();
    await Notification.deleteMany({ user: userId, read: true });
    return { ok: true };
}

function parseDeadline(deadline) {
    if (!deadline) return null;
    const parsed = new Date(deadline);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function checkApproachingDeadlines() {
    await connectDB();
    const Task = (await import("../models/Task.js")).default;
    const tasks = await Task.find({
        status: { $in: ["Open", "In Progress"] },
        deadline: { $exists: true, $ne: "" },
    }).populate("creator assignedFreelancer").lean();

    const now = Date.now();
    const windowMs = 24 * 60 * 60 * 1000;

    for (const task of tasks) {
        const deadline = parseDeadline(task.deadline);
        if (!deadline) continue;
        const msUntil = deadline.getTime() - now;
        if (msUntil <= 0 || msUntil > windowMs) continue;

        const hoursLeft = Math.max(1, Math.round(msUntil / (60 * 60 * 1000)));
        const recipients = new Set([task.creator?.toString?.() ?? task.creator?.toString()]);
        if (task.assignedFreelancer) {
            recipients.add(task.assignedFreelancer._id?.toString?.() ?? task.assignedFreelancer.toString());
        }

        for (const userId of recipients) {
            if (!userId) continue;
            const recent = await Notification.findOne({
                user: userId,
                type: "deadline_approaching",
                task: task._id,
                createdAt: { $gte: new Date(now - windowMs) },
            });
            if (recent) continue;

            const isClient = userId === (task.creator?._id?.toString?.() ?? task.creator?.toString());
            await createNotification({
                userId,
                type: "deadline_approaching",
                title: "Deadline approaching",
                message: `"${task.title}" is due in about ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.`,
                taskId: task._id.toString(),
                taskTitle: task.title,
                href: isClient ? "/tasks" : "/my-works",
            });
        }
    }
}
