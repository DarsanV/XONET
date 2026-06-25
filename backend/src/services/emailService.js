import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;
    if (env.smtpHost) {
        transporter = nodemailer.createTransport({
            host: env.smtpHost,
            port: env.smtpPort,
            secure: env.smtpPort === 465,
            auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined,
        });
    } else {
        transporter = nodemailer.createTransport({ jsonTransport: true });
    }
    return transporter;
}

async function sendMail({ to, subject, html, text }) {
    const info = await getTransporter().sendMail({
        from: env.emailFrom,
        to,
        subject,
        html,
        text,
    });
    if (!env.smtpHost && env.isDev) {
        const payload = typeof info.message === "string" ? JSON.parse(info.message) : info.message;
        console.log("\n[email] SMTP not configured — email preview:");
        console.log(`  To: ${to}`);
        console.log(`  Subject: ${subject}`);
        if (payload?.html) console.log(`  HTML: ${payload.html}`);
        else console.log(`  Text: ${text}`);
        console.log("");
    }
    return info;
}

export async function sendVerificationEmail(email, token) {
    const url = `${env.clientUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const subject = "Verify your XONET account";
    const text = `Welcome to XONET. Verify your email: ${url}`;
    const html = `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <h2 style="margin:0 0 16px;">Verify your email</h2>
            <p style="color:#555;line-height:1.6;">Thanks for joining XONET. Click the button below to verify your email and access your workspace.</p>
            <a href="${url}" style="display:inline-block;margin:24px 0;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">Verify email</a>
            <p style="color:#888;font-size:13px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
        </div>
    `;
    return sendMail({ to: email, subject, html, text });
}

export async function sendPasswordResetEmail(email, token) {
    const url = `${env.clientUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const subject = "Reset your XONET password";
    const text = `Reset your password: ${url}`;
    const html = `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <h2 style="margin:0 0 16px;">Reset your password</h2>
            <p style="color:#555;line-height:1.6;">We received a request to reset your password. Click below to choose a new one.</p>
            <a href="${url}" style="display:inline-block;margin:24px 0;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">Reset password</a>
            <p style="color:#888;font-size:13px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
    `;
    return sendMail({ to: email, subject, html, text });
}
