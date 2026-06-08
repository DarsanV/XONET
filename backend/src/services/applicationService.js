import connectDB from "../db/connect.js";
import Application from "../models/Application.js";
import Task from "../models/Task.js";
import Work from "../models/Work.js";
import User from "../models/User.js";
import { serializeApplication } from "../utils/serializers.js";
import { assignFreelancerToTask } from "./taskService.js";

export async function applyToTask(taskId, freelancerId, coverLetter, proposedRate = "") {
    await connectDB();
    const task = await Task.findById(taskId);
    if (!task) {
        const err = new Error("Task not found");
        err.status = 404;
        throw err;
    }
    if (task.creator.toString() === freelancerId.toString()) {
        const err = new Error("Cannot apply to your own task");
        err.status = 400;
        throw err;
    }
    if (task.status !== "Open") {
        const err = new Error("Task is not open for applications");
        err.status = 400;
        throw err;
    }
    const existing = await Application.findOne({ task: taskId, freelancer: freelancerId });
    if (existing) {
        const err = new Error("Already applied");
        err.status = 409;
        throw err;
    }
    const app = await Application.create({
        task: taskId,
        freelancer: freelancerId,
        coverLetter,
        proposedRate,
        status: "Pending",
    });
    const populated = await Application.findById(app._id).populate("task freelancer");
    return serializeApplication(populated);
}

export async function updateApplicationStatus(applicationId, ownerId, status) {
    await connectDB();
    const app = await Application.findById(applicationId).populate("task");
    if (!app) {
        const err = new Error("Application not found");
        err.status = 404;
        throw err;
    }
    const task = await Task.findById(app.task._id ?? app.task);
    if (!task) {
        const err = new Error("Task not found");
        err.status = 404;
        throw err;
    }
    if (task.creator.toString() !== ownerId.toString()) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
    }
    if (app.status !== "Pending" && status !== app.status) {
        const err = new Error(`Application is already ${app.status.toLowerCase()}`);
        err.status = 400;
        throw err;
    }
    if (status === "Accepted") {
        if (task.status !== "Open") {
            const err = new Error("Task is not open for assignment");
            err.status = 400;
            throw err;
        }
        await Application.updateMany(
            { task: task._id, _id: { $ne: app._id } },
            { status: "Rejected" }
        );
        app.status = "Accepted";
        await app.save();
        await assignFreelancerToTask(task._id.toString(), ownerId, app.freelancer.toString());
    }
    else {
        app.status = status;
        await app.save();
    }

    const populated = await Application.findById(app._id).populate("task freelancer");
    return serializeApplication(populated);
}

