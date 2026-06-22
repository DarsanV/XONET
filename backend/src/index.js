import { env } from "./config/env.js";
import connectDB from "./db/connect.js";
import app from "./app.js";

async function startServer() {
    try {
        await connectDB();
        console.log("Connected to MongoDB successfully");

        app.listen(env.port, () => {
            console.log(`XONET API running on http://localhost:${env.port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
// Restart triggered again
