import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAuth } from "../middleware/auth.js";
import * as auth from "../controllers/authController.js";
import * as workspace from "../controllers/workspaceController.js";
import * as tasks from "../controllers/taskController.js";
import * as applications from "../controllers/applicationController.js";
import * as works from "../controllers/workController.js";
import * as profile from "../controllers/profileController.js";
import * as freelancers from "../controllers/freelancerController.js";
import * as notifications from "../controllers/notificationController.js";

const router = Router();

router.get("/health", (req, res) => res.json({ success: true, data: { status: "ok" } }));

router.post("/auth/register", asyncHandler(auth.register));
router.post("/auth/login", asyncHandler(auth.login));
router.post("/auth/logout", asyncHandler(auth.logout));
router.post("/auth/refresh", asyncHandler(auth.refresh));
router.get("/auth/verify-email", asyncHandler(auth.verifyEmail));
router.post("/auth/verify-email", asyncHandler(auth.verifyEmail));
router.post("/auth/resend-verification", asyncHandler(auth.resendVerification));
router.post("/auth/forgot-password", asyncHandler(auth.forgotPassword));
router.post("/auth/reset-password", asyncHandler(auth.resetPassword));

router.get("/auth/me", requireAuth, asyncHandler(auth.me));
router.post("/auth/change-password", requireAuth, asyncHandler(auth.changePassword));

router.get("/workspace", requireAuth, asyncHandler(workspace.getWorkspaceData));

router.post("/tasks", requireAuth, asyncHandler(tasks.create));
router.patch("/tasks/:id", requireAuth, asyncHandler(tasks.update));
router.delete("/tasks/:id", requireAuth, asyncHandler(tasks.remove));

router.post("/applications", requireAuth, asyncHandler(applications.apply));
router.patch("/applications/:id", requireAuth, asyncHandler(applications.updateStatus));

router.patch("/works/:id", requireAuth, asyncHandler(works.updateProgress));

router.patch("/profile", requireAuth, asyncHandler(profile.update));

router.get("/freelancers", requireAuth, asyncHandler(freelancers.list));

router.get("/notifications", requireAuth, asyncHandler(notifications.list));
router.get("/notifications/unread-count", requireAuth, asyncHandler(notifications.unreadCount));
router.patch("/notifications/read-all", requireAuth, asyncHandler(notifications.markAllRead));
router.patch("/notifications/:id/read", requireAuth, asyncHandler(notifications.markRead));
router.delete("/notifications/:id", requireAuth, asyncHandler(notifications.remove));

export default router;
