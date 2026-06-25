import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

function parseDurationMs(value, fallbackMs) {
    if (!value) return fallbackMs;
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) return fallbackMs;
    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return amount * multipliers[unit];
}

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev-jwt-access-secret";
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || `${jwtAccessSecret}-refresh`;

export const env = {
    port: Number(process.env.PORT) || 4000,
    mongodbUri: process.env.MONGODB_URI,
    useMemoryDb: process.env.USE_MEMORY_DB === "true",
    isDev: process.env.NODE_ENV !== "production",
    isProduction: process.env.NODE_ENV === "production",
    jwtAccessSecret,
    jwtRefreshSecret,
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || "30d",
    refreshTokenMaxAgeMs: parseDurationMs(process.env.REFRESH_TOKEN_EXPIRES || "30d", 30 * 86_400_000),
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    smtpHost: process.env.SMTP_HOST || "",
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    smtpUser: process.env.SMTP_USER || "",
    smtpPass: process.env.SMTP_PASS || "",
    emailFrom: process.env.EMAIL_FROM || "XONET <noreply@xonet.io>",
};

if (!env.mongodbUri) {
    console.warn("[config] MONGODB_URI is not set");
}
