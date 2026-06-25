import * as notificationService from "../services/notificationService.js";

export async function list(req, res) {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const unreadOnly = req.query.unreadOnly === "true";
    const notifications = await notificationService.listNotifications(req.user.id, { limit, unreadOnly });
    const unreadCount = await notificationService.getUnreadCount(req.user.id);
    return res.json({ success: true, data: { notifications, unreadCount } });
}

export async function unreadCount(req, res) {
    const count = await notificationService.getUnreadCount(req.user.id);
    return res.json({ success: true, data: { unreadCount: count } });
}

export async function markRead(req, res) {
    const notification = await notificationService.markNotificationRead(req.user.id, req.params.id);
    const unreadCount = await notificationService.getUnreadCount(req.user.id);
    return res.json({ success: true, data: { notification, unreadCount } });
}

export async function markAllRead(req, res) {
    await notificationService.markAllNotificationsRead(req.user.id);
    return res.json({ success: true, data: { unreadCount: 0 } });
}

export async function remove(req, res) {
    await notificationService.deleteNotification(req.user.id, req.params.id);
    const unreadCount = await notificationService.getUnreadCount(req.user.id);
    return res.json({ success: true, data: { unreadCount } });
}
