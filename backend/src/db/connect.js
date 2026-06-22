import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "../config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localDbPath = path.resolve(__dirname, "../../../.data/mongo");

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

let mongoServer;
export let usingMemoryDb = false;

async function createPersistentMemoryServer() {
    fs.mkdirSync(localDbPath, { recursive: true });
    mongoServer = await MongoMemoryServer.create({
        instance: {
            dbName: "xonet",
            storageEngine: "wiredTiger",
            dbPath: localDbPath,
        },
    });
    return mongoServer.getUri();
}

async function connectWithFallback() {
    if (env.useMemoryDb || !env.mongodbUri) {
        usingMemoryDb = true;
        const uri = await createPersistentMemoryServer();
        const label = env.useMemoryDb ? "USE_MEMORY_DB=true" : "no MONGODB_URI";
        console.log(`[db] Using persistent local MongoDB (${label}) at ${localDbPath}`);
        return mongoose.connect(uri, { bufferCommands: false });
    }

    try {
        return await mongoose.connect(env.mongodbUri, { bufferCommands: false });
    } catch (err) {
        if (!env.isDev) {
            throw err;
        }
        usingMemoryDb = true;
        console.warn("[db] MongoDB Atlas connection failed, using persistent local DB:", err.message);
        const uri = await createPersistentMemoryServer();
        return mongoose.connect(uri, { bufferCommands: false });
    }
}

export default async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = connectWithFallback();
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
