import { createNotification } from "./notificationService.js";

export async function notifyApplicationReceived({ task, freelancer }) {
    await createNotification({
        userId: task.creator.toString(),
        type: "application_received",
        title: "New application",
        message: `${freelancer.fullName} applied to "${task.title}".`,
        taskId: task._id.toString(),
        taskTitle: task.title,
        href: "/tasks?tab=applications",
    });
}

export async function notifyTaskAssigned({ task, freelancer, client }) {
    await createNotification({
        userId: freelancer._id.toString(),
        type: "task_assigned",
        title: "Task assigned to you",
        message: `${client?.fullName ?? "A client"} assigned you to "${task.title}".`,
        taskId: task._id.toString(),
        taskTitle: task.title,
        href: "/my-works",
    });
}

export async function notifyTaskStatusChanged({ task, userId, previousStatus }) {
    if (task.status === previousStatus) return;
    await createNotification({
        userId,
        type: "task_status_changed",
        title: "Task status updated",
        message: `"${task.title}" is now ${task.status}.`,
        taskId: task._id.toString(),
        taskTitle: task.title,
        href: userId === task.creator?.toString?.() ? "/tasks" : "/my-works",
    });
}

export async function notifyProgressUpdated({ task, work, freelancer, clientId }) {
    await createNotification({
        userId: clientId,
        type: "progress_updated",
        title: "Progress updated",
        message: `${freelancer?.fullName ?? "Freelancer"} updated "${task.title}" to ${work.progress}%.`,
        taskId: task._id.toString(),
        taskTitle: task.title,
        href: "/tasks",
    });
}

export async function notifyPaymentStatusChanged({ task, userId, previousStatus }) {
    if (task.paymentStatus === previousStatus) return;
    await createNotification({
        userId,
        type: "payment_status_changed",
        title: "Payment status updated",
        message: `Payment for "${task.title}" is now ${task.paymentStatus}.`,
        taskId: task._id.toString(),
        taskTitle: task.title,
        href: "/tasks",
    });
}

export async function notifyTaskCompleted({ task, userIds }) {
    for (const userId of userIds) {
        if (!userId) continue;
        const isClient = userId === task.creator?.toString?.();
        await createNotification({
            userId,
            type: "task_completed",
            title: "Task completed",
            message: `"${task.title}" has been marked as completed.`,
            taskId: task._id.toString(),
            taskTitle: task.title,
            href: isClient ? "/tasks" : "/my-works",
        });
    }
}

export async function notifyProfileUpdated({ userId }) {
    await createNotification({
        userId,
        type: "profile_updated",
        title: "Profile updated",
        message: "Your profile changes have been saved successfully.",
        href: "/account",
    });
}
