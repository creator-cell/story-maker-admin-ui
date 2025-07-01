import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AdminRouters = [
    "/admin/users",
    "/admin/role"
];

const UserRoutes = [
   
];

const LogoutRoutes = [
    "/login",
    "/register",
    "/forget-password",
   
];

export async function middleware(require) {
    const token = require.cookies?.get("token");
    const { pathname } = require.nextUrl;
    
    const decodedPath = decodeURIComponent(pathname);
  
    const IsAdminPath = AdminRouters?.includes(decodedPath);
    const IsUserPath = UserRoutes?.includes(decodedPath);
    const IsLogoutPath = LogoutRoutes?.includes(decodedPath);
    
    // If user is already on /admin/users, don't redirect
    if (decodedPath === "/admin/users") {
        return NextResponse.next();
    }
    
    // If it's a logout route, allow access
    if (IsLogoutPath) {
        return NextResponse.next();
    }
    
    if (IsAdminPath && token?.value) {
        try {
            const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
            const decode = await jwtVerify(token.value, secret);
            
            // Check if token is expired
            if (decode.payload.exp * 1000 < Date.now()) {
                return NextResponse.redirect(new URL("/login", require?.url));
            }
            
            // If user has valid token and is not on admin/users, redirect them there
            return NextResponse.redirect(new URL("/admin/users", require?.url));
            
        } catch (error) {
            return NextResponse.redirect(new URL("/login", require?.url));
        }
    } else {
        // No token, redirect to login
        return NextResponse.redirect(new URL("/login", require?.url));
    }
}

export const config = {
    matcher: [
        "/((?!api|static|.*\\..*|_next|favicon.ico|%PUBLIC_URL%).*)"
    ]
}
