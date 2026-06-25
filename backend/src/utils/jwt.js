import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(payload) {
    return jwt.sign(
        { ...payload, type: "access" },
        env.jwtAccessSecret,
        { expiresIn: env.accessTokenExpires },
    );
}

export function signRefreshToken(payload) {
    return jwt.sign(
        { ...payload, type: "refresh" },
        env.jwtRefreshSecret,
        { expiresIn: env.refreshTokenExpires },
    );
}

export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, env.jwtAccessSecret);
    if (decoded.type !== "access") {
        throw new Error("Invalid token type");
    }
    return decoded;
}

export function verifyRefreshTokenJwt(token) {
    const decoded = jwt.verify(token, env.jwtRefreshSecret);
    if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
    }
    return decoded;
}
