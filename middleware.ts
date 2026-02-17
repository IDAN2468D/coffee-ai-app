
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdmin = token?.role === "ADMIN" || token?.isAdmin === true;
        const isBarista = token?.role === "BARISTA";

        // Protect /admin
        if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
            return NextResponse.rewrite(new URL("/auth/unauthorized", req.url));
            // or redirect to home
            // return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/vip/:path*", "/loyalty/:path*"],
};
