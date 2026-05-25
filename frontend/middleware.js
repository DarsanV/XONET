import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const authRoutes = ["/login", "/signup"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
    const isApiAuth = pathname.startsWith("/api/auth");
    const isPublicApi = pathname.startsWith("/api/auth/register");

    if (isApiAuth || isPublicApi) {
        return NextResponse.next();
    }

    if (!isLoggedIn && pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!isLoggedIn && !isAuthRoute) {
        const login = new URL("/login", req.nextUrl.origin);
        login.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(login);
    }

    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
