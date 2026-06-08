import connectDB from "../db/connect.js";
import Task from "../models/Task.js";
import Application from "../models/Application.js";
import Work from "../models/Work.js";
import User from "../models/User.js";
import { serializeTask } from "../utils/serializers.js";
import { canActAsFreelancer } from "../middleware/auth.js";

const UPDATABLE_TASK_FIELDS = [
    "title",
    "description",
    "skills",
    "budget",
    "deadline",
    "experienceLevel",
    "category",
    "status",
    "paymentStatus",
];

function randomMatch() {
    return Math.floor(75 + Math.random() * 24);
}

export async function createTask(creatorId, input) {
    await connectDB();
    const task = await Task.create({
        creator: creatorId,
        ...input,
        status: "Open",
        match: randomMatch(),
        paymentStatus: "Unpaid",
        progress: 0,
    });
    const populated = await Task.findById(task._id).populate("creator assignedFreelancer");
    return serializeTask(populated);
}

export async function updateTask(taskId, userId, input) {
    await connectDB();
    const task = await Task.findById(taskId);
    if (!task) {
        const err = new Error("Task not found");
        err.status = 404;
        throw err;
    }
    if (task.creator.toString() !== userId.toString()) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
    }
    const safeInput = {};
    for (const key of UPDATABLE_TASK_FIELDS) {
        if (input[key] !== undefined) {
            safeInput[key] = input[key];
        }
    }
    if (safeInput.status === "Open" && task.assignedFreelancer) {
        const err = new Error("Cannot reopen a task with an assigned freelancer");
        err.status = 400;
        throw err;
    }
    Object.assign(task, safeInput);
    await task.save();
    const populated = await Task.findById(task._id).populate("creator assignedFreelancer");
    return serializeTask(populated);
}

export async function deleteTask(taskId, userId) {
    await connectDB();
    const task = await Task.findById(taskId);
    if (!task) {
        const err = new Error("Task not found");
        err.status = 404;
        throw err;
    }
    if (task.creator.toString() !== userId.toString()) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
    }
    await Promise.all([
        Application.deleteMany({ task: taskId }),
        Work.deleteMany({ task: taskId }),
        Task.findByIdAndDelete(taskId),
    ]);
    return { ok: true };
}

async function ensureWork(task, freelancerId) {
    const creator = await User.findById(task.creator);
    let work = await Work.findOne({ task: task._id });
    if (work) {
        work.freelancer = freelancerId;
        work.status = "Active";
        await work.save();
    }
    else {
        work = await Work.create({
            task: task._id,
            freelancer: freelancerId,
            project: task.title,
            client: creator?.fullName ?? "Client",
            status: "Active",
            payment: task.budget,
            progress: task.progress || 5,
            deadline: task.deadline,
        });
    }
    return work;
}

export async function assignFreelancerToTask(taskId, ownerId, freelancerId) {
    await connectDB();
    const task = await Task.findById(taskId);
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
    const freelancer = await User.findById(freelancerId);
    if (!freelancer) {
        const err = new Error("Freelancer not found");
        err.status = 404;
        throw err;
    }
    if (!canActAsFreelancer(freelancer)) {
        const err = new Error("User cannot be assigned as a freelancer");
        err.status = 400;
        throw err;
    }
    if (task.status !== "Open") {
        const alreadyAssigned = task.assignedFreelancer?.toString() === freelancerId.toString();
        if (!alreadyAssigned) {
            const err = new Error("Task is not open for assignment");
            err.status = 400;
            throw err;
        }
    }
    if (task.assignedFreelancer && task.assignedFreelancer.toString() !== freelancerId.toString()) {
        const err = new Error("Task already has an assigned freelancer");
        err.status = 409;
        throw err;
    }
    await ensureWork(task, freelancerId);
    task.status = "In Progress";
    task.assignedFreelancer = freelancerId;
    task.paymentStatus = task.paymentStatus === "Paid" ? "Paid" : "Partial";
    task.progress = task.progress || 5;
    task.lastActivity = "Freelancer assigned — collaboration started";
    task.lastActivityAt = new Date();
    await task.save();
    const populated = await Task.findById(task._id).populate("creator assignedFreelancer");
    return serializeTask(populated);
}

