import mongoose from "mongoose";
import { env } from "../config/env.js";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export default async function connectDB() {
    if (!env.mongodbUri) {
        throw new Error("MONGODB_URI is not configured");
    }
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(env.mongodbUri, { bufferCommands: false });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
