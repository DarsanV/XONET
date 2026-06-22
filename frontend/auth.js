import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config.js";
import { API_URL } from "./lib/api-url.js";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email = credentials?.email?.toString().trim().toLowerCase();
                const password = credentials?.password?.toString();
                if (!email || !password) {
                    throw new Error("Email and password are required");
                }
                let res;
                try {
                    res = await fetch(`${API_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });
                } catch {
                    throw new Error("Cannot reach the API server. Is the backend running?");
                }
                const json = await res.json().catch(() => ({}));
                if (!res.ok || !json.success) {
                    throw new Error(json.error || "Invalid email or password");
                }
                return {
                    id: json.data.user.id,
                    email: json.data.user.email,
                    name: json.data.user.name,
                    role: json.data.user.role,
                    accessToken: json.data.token,
                };
            },
        }),
    ],
});
