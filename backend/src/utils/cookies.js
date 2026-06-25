import { env } from "../config/env.js";

const REFRESH_COOKIE = "xonet_refresh";

export function setRefreshTokenCookie(res, token) {
    res.cookie(REFRESH_COOKIE, token, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? "strict" : "lax",
        maxAge: env.refreshTokenMaxAgeMs,
        path: "/api/auth",
    });
}

export function clearRefreshTokenCookie(res) {
    res.clearCookie(REFRESH_COOKIE, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? "strict" : "lax",
        path: "/api/auth",
    });
}

export function getRefreshTokenFromCookie(req) {
    return req.cookies?.[REFRESH_COOKIE] ?? null;
}

export { REFRESH_COOKIE };
