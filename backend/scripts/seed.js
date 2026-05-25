import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * Optional seed: npm run seed
 * Creates demo users and sample tasks in MongoDB Atlas.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("Set MONGODB_URI in backend/.env before running seed.");
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    headline: String,
    skills: [String],
    available: Boolean,
    hourlyRate: String,
    location: String,
});

const taskSchema = new mongoose.Schema({
    creator: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    skills: [String],
    budget: String,
    deadline: String,
    experienceLevel: String,
    category: String,
    status: String,
    match: Number,
    paymentStatus: String,
    progress: Number,
});

async function main() {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.models.User || mongoose.model("User", userSchema);
    const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

    const count = await User.countDocuments();
    if (count > 0) {
        console.log("Database already has users — skipping seed.");
        await mongoose.disconnect();
        return;
    }

    const password = await bcrypt.hash("password123", 12);
    const client = await User.create({
        fullName: "XONET Client",
        email: "client@xonet.io",
        password,
        role: "client",
        headline: "Product lead",
        skills: ["Product", "Strategy"],
        available: true,
        location: "Remote",
    });
    await User.create({
        fullName: "Alex Mercer",
        email: "freelancer@xonet.io",
        password,
        role: "freelancer",
        headline: "Senior Full-Stack Engineer",
        skills: ["React", "Next.js", "Node.js", "TypeScript"],
        available: true,
        hourlyRate: "95",
        location: "Lisbon, Portugal",
    });

    await Task.create({
        creator: client._id,
        title: "Shopify Hydrogen migration",
        description: "Migrate legacy Shopify storefront to Hydrogen with improved Core Web Vitals.",
        skills: ["Shopify", "Hydrogen", "Remix"],
        budget: "$5,400",
        deadline: "Oct 28, 2026",
        experienceLevel: "Senior",
        category: "Engineering",
        status: "Open",
        match: 88,
        paymentStatus: "Unpaid",
        progress: 0,
    });

    console.log("Seeded demo users:");
    console.log("  client@xonet.io / password123");
    console.log("  freelancer@xonet.io / password123");
    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
