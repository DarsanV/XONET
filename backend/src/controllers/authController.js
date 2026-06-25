import { z } from "zod";
import * as authService from "../services/authService.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshTokenFromCookie } from "../utils/cookies.js";

const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["freelancer", "client", "both"]),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const emailSchema = z.object({
    email: z.string().email(),
});

const verifyEmailSchema = z.object({
    token: z.string().min(1),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
});

const refreshSchema = z.object({
    refreshToken: z.string().min(1).optional(),
});

function requestMeta(req) {
    return {
        userAgent: req.headers["user-agent"] ?? "",
        ipAddress: req.ip ?? req.socket?.remoteAddress ?? "",
    };
}

export async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message });
    }
    const result = await authService.registerUser(parsed.data);
    return res.status(201).json({ success: true, data: result });
}

export async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: "Invalid credentials" });
    }
    try {
        const result = await authService.loginUser(parsed.data, requestMeta(req));
        setRefreshTokenCookie(res, result.refreshToken);
        return res.json({
            success: true,
            data: {
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    } catch (err) {
        if (err.code === "EMAIL_NOT_VERIFIED") {
            return res.status(403).json({ success: false, error: err.message, code: err.code });
        }
        throw err;
    }
}

export async function logout(req, res) {
    const bodyToken = req.body?.refreshToken;
    const cookieToken = getRefreshTokenFromCookie(req);
    await authService.revokeRefreshToken(bodyToken || cookieToken);
    clearRefreshTokenCookie(res);
    return res.json({ success: true, data: { message: "Logged out successfully" } });
}

export async function refresh(req, res) {
    const parsed = refreshSchema.safeParse(req.body ?? {});
    const refreshToken = parsed.data?.refreshToken || getRefreshTokenFromCookie(req);
    if (!refreshToken) {
        return res.status(401).json({ success: false, error: "Refresh token required" });
    }
    const result = await authService.refreshAccessToken(refreshToken, requestMeta(req));
    setRefreshTokenCookie(res, result.refreshToken);
    return res.json({
        success: true,
        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user,
        },
    });
}

export async function me(req, res) {
    const user = await authService.getCurrentUser(req.user.id);
    return res.json({ success: true, data: { user } });
}

export async function verifyEmail(req, res) {
    const token = req.body?.token || req.query?.token;
    const parsed = verifyEmailSchema.safeParse({ token });
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: "Verification token is required" });
    }
    const result = await authService.verifyEmail(parsed.data.token);
    return res.json({ success: true, data: result });
}

export async function resendVerification(req, res) {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: "Valid email is required" });
    }
    const result = await authService.resendVerificationEmail(parsed.data.email);
    return res.json({ success: true, data: result });
}

export async function forgotPassword(req, res) {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: "Valid email is required" });
    }
    const result = await authService.requestPasswordReset(parsed.data.email);
    return res.json({ success: true, data: result });
}

export async function resetPassword(req, res) {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message || "Invalid request" });
    }
    const result = await authService.resetPassword(parsed.data.token, parsed.data.password);
    return res.json({ success: true, data: result });
}

export async function changePassword(req, res) {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors[0]?.message || "Invalid request" });
    }
    const result = await authService.changePassword(
        req.user.id,
        parsed.data.currentPassword,
        parsed.data.newPassword,
    );
    clearRefreshTokenCookie(res);
    return res.json({ success: true, data: result });
}
