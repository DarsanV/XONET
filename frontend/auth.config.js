export const authConfig = {
    providers: [],
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            session.accessToken = token.accessToken;
            return session;
        },
    },
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET,
};
