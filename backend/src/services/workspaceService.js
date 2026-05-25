import connectDB from "../db/connect.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Application from "../models/Application.js";
import Work from "../models/Work.js";
import {
    serializeTask,
    serializeApplication,
    serializeWork,
    serializeProfile,
    serializeFreelancer,
} from "../utils/serializers.js";

function uniqueById(items, getId) {
    const map = new Map();
    for (const item of items) {
        map.set(getId(item), item);
    }
    return [...map.values()];
}

export async function getWorkspace(userId) {
    await connectDB();
    const uid = userId.toString();

    const [user, createdTasks, assignedTasks, openMarketTasks, myApplications, works, freelancers] = await Promise.all([
        User.findById(uid).lean(),
        Task.find({ creator: uid }).populate("creator assignedFreelancer").lean(),
        Task.find({ assignedFreelancer: uid }).populate("creator assignedFreelancer").lean(),
        Task.find({ status: "Open", creator: { $ne: uid } }).populate("creator assignedFreelancer").lean(),
        Application.find({ freelancer: uid }).populate("task freelancer").lean(),
        Work.find({ freelancer: uid }).populate("task").lean(),
        User.find({
            _id: { $ne: uid },
            role: { $in: ["freelancer", "both"] },
        }).lean(),
    ]);

    const ownedTaskIds = createdTasks.map((t) => t._id.toString());
    const appsOnMyTasks = ownedTaskIds.length
        ? await Application.find({ task: { $in: ownedTaskIds } }).populate("task freelancer").lean()
        : [];

    const allTasksRaw = uniqueById(
        [...createdTasks, ...assignedTasks, ...openMarketTasks],
        (t) => t._id.toString()
    );

    const tasks = allTasksRaw.map(serializeTask);
    const applications = uniqueById(
        [...appsOnMyTasks, ...myApplications],
        (a) => a._id.toString()
    ).map(serializeApplication);

    return {
        profile: serializeProfile(user),
        tasks,
        applications,
        works: works.map(serializeWork),
        freelancers: freelancers.map(serializeFreelancer),
        userId: uid,
        userRole: user?.role,
    };
}

