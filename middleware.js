import { i18nRouter } from "next-i18n-router";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import i8nConfig from "@/i18nConfig";

const AdminRouters = [
    
    "/admin/users",
    "/admin/role",
    "/ar/admin/users",
    "/ar/admin/role",
];

const UserRoutes = [
    "/user/sports-transparency-info",
   "/ar/user/sports-transparency-info",
];

const LogoutRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/ar/login",
    "/ar/register",
    "/ar/forgot-password",
];

export async function middleware(require) {
    const token = require.cookies?.get("token");
    const { pathname } = require.nextUrl;
    
    // Skip middleware for root path when coming from admin routes
    // if (pathname === '/' && require.headers.get('referer')?.includes('/admin')) {
    //     return NextResponse.next();
    // }
    // if (pathname === '/') {
    //     // Allow direct access to root path
    //     return NextResponse.next();
    // }
    
    const decodedPath = decodeURIComponent(pathname);

    console.log(decodedPath);
  
    const IsAdminPath = AdminRouters?.includes(decodedPath);
    const IsUserPath = UserRoutes?.includes(decodedPath);
    const IsLogoutPath = LogoutRoutes?.includes(decodedPath);
    if (!IsLogoutPath && token?.value) {
        try {
            const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
            const decode = await jwtVerify(token.value, secret);
         
            if (decode.payload.exp * 1000 < Date.now()) {
                return NextResponse.redirect(new URL("/login", require?.url));
            }
            
          
        } catch (error) {
            return NextResponse.redirect(new URL("/login", require?.url));
        }
    }
    
  else if (!token?.value && (IsUserPath || IsAdminPath)) {
        return NextResponse.redirect(new URL("/login", require?.url));
    } else if (!IsLogoutPath && token?.value && (IsUserPath || IsAdminPath)) {
        try {
            const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
            const decode = await jwtVerify(token.value, secret);

            if ((IsAdminPath && !decode?.payload?.isAdmin) || (IsUserPath && decode?.payload?.isAdmin)) {
                return NextResponse.redirect(new URL("/", require?.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL("/login", require?.url));
        }
    }
    return i18nRouter(require, i8nConfig);
}


export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)"
}