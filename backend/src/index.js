import { env } from "./config/env.js";
import connectDB from "./db/connect.js";
import User from "./models/User.js";
import app from "./app.js";
import { checkApproachingDeadlines } from "./services/notificationService.js";

const DEADLINE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

async function migrateExistingUsers() {
    await connectDB();
    const result = await User.updateMany(
        { emailVerified: { $exists: false } },
        { $set: { emailVerified: true } },
    );
    if (result.modifiedCount > 0) {
        console.log(`[db] Migrated ${result.modifiedCount} existing user(s) to verified email status`);
    }
}

async function startServer() {
    try {
        await connectDB();
        await migrateExistingUsers();
        console.log("Connected to MongoDB successfully");

        app.listen(env.port, () => {
            console.log(`XONET API running on http://localhost:${env.port}`);
        });

        checkApproachingDeadlines().catch((err) => console.error("[notifications] Deadline check failed:", err));
        setInterval(() => {
            checkApproachingDeadlines().catch((err) => console.error("[notifications] Deadline check failed:", err));
        }, DEADLINE_CHECK_INTERVAL_MS);
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
// Restart triggered again
