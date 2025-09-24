

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

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
  //  return i18nRouter(require, i8nConfig);
}


export const config = {
    matcher: [
        "/((?!api|static|.*\\..*|_next|favicon.ico|%PUBLIC_URL%).*)"
    ]
}


// import { i18nRouter } from "next-i18n-router";
// import i8nConfig from "../i18nConfig";
// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const AdminRouters = [
//     "/admin/user",
//     "/admin/conference",
//     "/admin/news",
//     "/admin/sports-transparency-info",
//     "/admin/change-password",
//     "/admin/resources",
//     "/tl/admin/user",
//     "/tl/admin/change-password",
//     "/admin/resources",
//     "/admin/event-user",
//     "/admin/event-user-list",
//     "/admin/setting"
// ];

// const UserRoutes = [
//     "/user/sports-transparency-info",
//     "/admin/conference",
// ];

// const LogoutRoutes = [
//     "/login",
//     "/register",
//     "/forget-password",
//     "/tl/login",
//     "/tl/register",
//     "/tl/forget-password"
// ];

// export async function middleware(request) {
//     const token = request.cookies?.get("token");
//     const { pathname } = request.nextUrl;
    
//     const decodedPath = decodeURIComponent(pathname);
  
//     const isAdminPath = AdminRouters.some(route => decodedPath.startsWith(route) || decodedPath === route);
//     const isUserPath = UserRoutes.includes(decodedPath);
//     const isLogoutPath = LogoutRoutes.includes(decodedPath);
    
//     // If trying to access admin routes
//     if (isAdminPath) {
//         // Check if token exists
//         if (!token?.value) {
//             return NextResponse.redirect(new URL("/login", request.url));
//         }
        
//         try {
//             // Verify token
//             const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
//             const decode = await jwtVerify(token.value, secret);
            
//             // Check token expiration
//             if (decode.payload.exp * 1000 < Date.now()) {
//                 return NextResponse.redirect(new URL("/login", request.url));
//             }
            
//             // Check if user is admin
//             if (!decode.payload.isAdmin) {
//                 return NextResponse.redirect(new URL("/", request.url));
//             }
//         } catch (error) {
//             return NextResponse.redirect(new URL("/login", request.url));
//         }
//     }
    
//     // For user routes that require authentication
//     else if (isUserPath) {
//       console.log("isUserPath", isUserPath);
//         if (!token?.value) {
//             return NextResponse.redirect(new URL("/login", request.url));
//         }
        
//         try {
//             const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
//             const decode = await jwtVerify(token.value, secret);
            
//             if (decode.payload.exp * 1000 < Date.now()) {
//                 return NextResponse.redirect(new URL("/login", request.url));
//             }
//         } catch (error) {
//             return NextResponse.redirect(new URL("/login", request.url));
//         }
//     }
    
//     // For logout routes (login, register, etc.), redirect to home if already logged in
//     else if (isLogoutPath && token?.value) {
//         try {
//             const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
//             const decode = await jwtVerify(token.value, secret);
            
//             if (decode.payload.exp * 1000 >= Date.now()) {
//                 return NextResponse.redirect(new URL("/", request.url));
//             }
//         } catch (error) {
//             // If token is invalid, continue to login page
//         }
//     }
    
//     return i18nRouter(request, i8nConfig);
// }

// export const config = {
//     matcher: [
//         "/((?!api|static|.*\\..*|_next|favicon.ico|%PUBLIC_URL%).*)"
//     ]
// }
