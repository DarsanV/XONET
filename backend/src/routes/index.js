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

const router = Router();

router.get("/health", (req, res) => res.json({ success: true, data: { status: "ok" } }));

router.post("/auth/register", asyncHandler(auth.register));
router.post("/auth/login", asyncHandler(auth.login));

router.get("/workspace", requireAuth, asyncHandler(workspace.getWorkspaceData));

router.post("/tasks", requireAuth, asyncHandler(tasks.create));
router.patch("/tasks/:id", requireAuth, asyncHandler(tasks.update));
router.delete("/tasks/:id", requireAuth, asyncHandler(tasks.remove));

router.post("/applications", requireAuth, asyncHandler(applications.apply));
router.patch("/applications/:id", requireAuth, asyncHandler(applications.updateStatus));

router.patch("/works/:id", requireAuth, asyncHandler(works.updateProgress));

router.patch("/profile", requireAuth, asyncHandler(profile.update));

router.get("/freelancers", requireAuth, asyncHandler(freelancers.list));

export default router;
