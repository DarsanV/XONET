import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

export const env = {
    port: Number(process.env.PORT) || 4000,
    mongodbUri: process.env.MONGODB_URI,
    useMemoryDb: process.env.USE_MEMORY_DB === "true",
    isDev: process.env.NODE_ENV !== "production",
    jwtSecret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev-jwt-secret",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};

if (!env.mongodbUri) {
    console.warn("[config] MONGODB_URI is not set");
}
