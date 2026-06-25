import bcrypt from "bcryptjs";
import connectDB from "../db/connect.js";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { serializeUser } from "../utils/serializers.js";
import { generateSecureToken, hashToken } from "../utils/crypto.js";
import { signAccessToken } from "../utils/jwt.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./emailService.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;
const EMAIL_VERIFY_HOURS = 24;
const PASSWORD_RESET_HOURS = 1;

function authUserResponse(user) {
    return {
        id: user._id.toString(),
        email: user.email,
        name: user.fullName,
        role: user.role,
        emailVerified: user.emailVerified,
    };
}

export async function createRefreshToken(userId, meta = {}) {
    await connectDB();
    const plainToken = generateSecureToken();
    const tokenHash = hashToken(plainToken);
    const expiresAt = new Date(Date.now() + env.refreshTokenMaxAgeMs);
    await RefreshToken.create({
        user: userId,
        tokenHash,
        expiresAt,
        userAgent: meta.userAgent ?? "",
        ipAddress: meta.ipAddress ?? "",
    });
    return { plainToken, expiresAt };
}

export async function rotateRefreshToken(plainToken, meta = {}) {
    await connectDB();
    const tokenHash = hashToken(plainToken);
    const existing = await RefreshToken.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
    if (!existing) {
        const err = new Error("Invalid or expired refresh token");
        err.status = 401;
        throw err;
    }
    await RefreshToken.deleteOne({ _id: existing._id });
    return createRefreshToken(existing.user.toString(), meta);
}

export async function revokeRefreshToken(plainToken) {
    if (!plainToken) return;
    await connectDB();
    await RefreshToken.deleteOne({ tokenHash: hashToken(plainToken) });
}

export async function revokeAllUserRefreshTokens(userId) {
    await connectDB();
    await RefreshToken.deleteMany({ user: userId });
}

export async function issueAuthTokens(user, meta = {}) {
    const accessToken = signAccessToken({
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
    });
    const { plainToken: refreshToken, expiresAt } = await createRefreshToken(user._id, meta);
    return { accessToken, refreshToken, refreshExpiresAt: expiresAt };
}

export async function registerUser({ fullName, email, password, role }) {
    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
        const err = new Error("An account with this email already exists");
        err.status = 409;
        throw err;
    }
    const verificationToken = generateSecureToken();
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashed,
        role,
        emailVerified: false,
        emailVerificationTokenHash: hashToken(verificationToken),
        emailVerificationExpires: new Date(Date.now() + EMAIL_VERIFY_HOURS * 60 * 60 * 1000),
        headline: "",
        skills: [],
        experience: [],
    });
    await sendVerificationEmail(user.email, verificationToken);
    return {
        user: serializeUser(user),
        message: "Account created. Please check your email to verify your account.",
        ...(env.isDev && !env.smtpHost ? { devVerificationToken: verificationToken } : {}),
    };
}

export async function loginUser({ email, password }, meta = {}) {
    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
        const err = new Error("Invalid email or password");
        err.status = 401;
        throw err;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        const err = new Error("Invalid email or password");
        err.status = 401;
        throw err;
    }
    if (!user.emailVerified) {
        const err = new Error("Please verify your email before signing in");
        err.status = 403;
        err.code = "EMAIL_NOT_VERIFIED";
        throw err;
    }
    user.lastLoginAt = new Date();
    await user.save();
    const tokens = await issueAuthTokens(user, meta);
    return {
        user: authUserResponse(user),
        ...tokens,
    };
}

export async function verifyEmail(token) {
    await connectDB();
    const tokenHash = hashToken(token);
    const user = await User.findOne({
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationTokenHash +emailVerificationExpires");
    if (!user) {
        const err = new Error("Invalid or expired verification link");
        err.status = 400;
        throw err;
    }
    user.emailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;
    await user.save();
    return { message: "Email verified successfully. You can now sign in." };
}

export async function resendVerificationEmail(email) {
    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+emailVerificationTokenHash +emailVerificationExpires");
    if (!user) {
        return { message: "If an account exists, a verification email has been sent." };
    }
    if (user.emailVerified) {
        const err = new Error("This email is already verified");
        err.status = 400;
        throw err;
    }
    const verificationToken = generateSecureToken();
    user.emailVerificationTokenHash = hashToken(verificationToken);
    user.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFY_HOURS * 60 * 60 * 1000);
    await user.save();
    await sendVerificationEmail(user.email, verificationToken);
    return {
        message: "Verification email sent.",
        ...(env.isDev && !env.smtpHost ? { devVerificationToken: verificationToken } : {}),
    };
}

export async function requestPasswordReset(email) {
    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordResetTokenHash +passwordResetExpires");
    if (!user) {
        return { message: "If an account exists, a reset link has been sent." };
    }
    const resetToken = generateSecureToken();
    user.passwordResetTokenHash = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_HOURS * 60 * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail(user.email, resetToken);
    return {
        message: "If an account exists, a reset link has been sent.",
        ...(env.isDev && !env.smtpHost ? { devResetToken: resetToken } : {}),
    };
}

export async function resetPassword(token, newPassword) {
    await connectDB();
    const tokenHash = hashToken(token);
    const user = await User.findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: { $gt: new Date() },
    }).select("+password +passwordResetTokenHash +passwordResetExpires");
    if (!user) {
        const err = new Error("Invalid or expired reset link");
        err.status = 400;
        throw err;
    }
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();
    await revokeAllUserRefreshTokens(user._id);
    return { message: "Password reset successfully. Please sign in." };
}

export async function changePassword(userId, currentPassword, newPassword) {
    await connectDB();
    const user = await User.findById(userId).select("+password");
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
        const err = new Error("Current password is incorrect");
        err.status = 400;
        throw err;
    }
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();
    await revokeAllUserRefreshTokens(userId);
    return { message: "Password changed successfully. Please sign in again." };
}

export async function refreshAccessToken(plainRefreshToken, meta = {}) {
    const rotated = await rotateRefreshToken(plainRefreshToken, meta);
    await connectDB();
    const session = await RefreshToken.findOne({ tokenHash: hashToken(rotated.plainToken) });
    if (!session) {
        const err = new Error("Invalid refresh token");
        err.status = 401;
        throw err;
    }
    const user = await User.findById(session.user);
    if (!user) {
        const err = new Error("User not found");
        err.status = 401;
        throw err;
    }
    const accessToken = signAccessToken({
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
    });
    return {
        accessToken,
        refreshToken: rotated.plainToken,
        user: authUserResponse(user),
    };
}

export async function getCurrentUser(userId) {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }
    return {
        ...authUserResponse(user),
        fullName: user.fullName,
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        createdAt: user.createdAt?.toISOString() ?? null,
    };
}

export async function getUserById(userId) {
    await connectDB();
    const user = await User.findById(userId);
    return serializeUser(user);
}
