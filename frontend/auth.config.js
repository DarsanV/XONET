export const authConfig = {
    providers: [],
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.emailVerified = user.emailVerified;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
                token.error = undefined;
            }

            if (trigger === "update" && session?.accessToken) {
                token.accessToken = session.accessToken;
                token.refreshToken = session.refreshToken ?? token.refreshToken;
                token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
                token.error = undefined;
                return token;
            }

            if (token.error === "RefreshAccessTokenError") {
                return token;
            }

            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires - 60_000) {
                return token;
            }

            if (!token.refreshToken) {
                return { ...token, error: "RefreshAccessTokenError" };
            }

            try {
                const { refreshAccessToken } = await import("@/lib/auth-refresh");
                const data = await refreshAccessToken(token.refreshToken);
                return {
                    ...token,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000,
                    error: undefined,
                };
            } catch {
                return { ...token, error: "RefreshAccessTokenError" };
            }
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.emailVerified = token.emailVerified;
            }
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.error = token.error;
            return session;
        },
    },
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET,
};
