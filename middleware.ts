import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types/auth";

// Define role-based route access
const roleRoutes: Record<UserRole, string[]> = {
  STUDENT: ["/dashboard", "/cart", "/profile", "/courses", "/payment"],
  COACH: ["/coaching-dashboard", "/profile", "/courses", "/students"], 
  ADMIN: ["/admin-dashboard", "/profile", "/users", "/courses", "/coaches", "/analytics"]
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    
    // If no token and trying to access protected route, redirect to login
    if (!token && isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // If token exists, check role-based access
    if (token) {
      const userRoles = (token.roles as UserRole[]) || [token.role as UserRole];
      const primaryRole = token.role as UserRole;
      
      // Check if user has access to the requested route with any of their roles
      if (isProtectedRoute(pathname) && !hasAccessWithRoles(userRoles, pathname)) {
        // Redirect to appropriate dashboard based on primary role
        const redirectUrl = getDefaultDashboard(primaryRole);
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (!isProtectedRoute(pathname)) {
          return true;
        }
        
        // Require token for protected routes
        return !!token;
      },
    },
  }
);

function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    "/dashboard",
    "/admin-dashboard", 
    "/coaching-dashboard",
    "/profile",
    "/cart",
    "/payment",
    "/courses",
    "/students",
    "/users",
    "/coaches",
    "/analytics"
  ];
  
  return protectedPaths.some(path => pathname.startsWith(path));
}

function hasAccessWithRoles(userRoles: UserRole[], pathname: string): boolean {
  // Check if any of the user's roles allow access to the pathname
  return userRoles.some(role => {
    const allowedRoutes = roleRoutes[role];
    return allowedRoutes.some(route => pathname.startsWith(route));
  });
}

function hasAccess(userRole: UserRole, pathname: string): boolean {
  const allowedRoutes = roleRoutes[userRole];
  return allowedRoutes.some(route => pathname.startsWith(route));
}

function getDefaultDashboard(userRole: UserRole): string {
  switch (userRole) {
    case "STUDENT":
      return "/dashboard";
    case "COACH":
      return "/coaching-dashboard";
    case "ADMIN":
      return "/admin-dashboard";
    default:
      return "/";
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
    "/coaching-dashboard/:path*", 
    "/profile/:path*",
    "/cart/:path*",
    "/payment/:path*",
    "/courses/:path*",
    "/students/:path*",
    "/users/:path*",
    "/coaches/:path*",
    "/analytics/:path*"
  ]
};
