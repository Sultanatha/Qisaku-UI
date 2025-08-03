import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("token")?.value;
  
  // Daftar path yang memerlukan autentikasi (protected routes)
  const protectedPaths = [
    "/admin",
    "/profile", 
    "/settings",
    "/admin",
    "/api/protected"
  ];
  
  // Daftar path yang hanya bisa diakses jika BELUM login (auth routes)
  const authPaths = ["/auth/sign-in", "/auth/sign-up", "/forgot-password"];
  
  // Daftar path public yang bisa diakses tanpa login
  const publicPaths = ["/", "/about", "/contact", "/favicon.ico"];
  
  const { pathname } = request.nextUrl;
  
  // Cek apakah path saat ini adalah protected route
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Cek apakah path saat ini adalah auth route
  const isAuthPath = authPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Cek apakah path saat ini adalah public route
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  );
  
  console.log({
    pathname,
    isLoggedIn: !!isLoggedIn,
    isProtectedPath,
    isAuthPath,
    isPublicPath
  });
  
  // Jika user belum login dan mencoba akses protected route
  if (!isLoggedIn && isProtectedPath) {
    console.log("Redirecting to sign-in: User not logged in accessing protected route");
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
  
  // Jika user sudah login dan mencoba akses auth pages (sign-in, sign-up, etc)
  if (isLoggedIn && isAuthPath) {
    console.log("Redirecting to dashboard: Logged in user accessing auth page");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Jika user belum login dan path bukan public/auth, redirect ke sign-in
  if (!isLoggedIn && !isPublicPath && !isAuthPath) {
    console.log("Redirecting to sign-in: Accessing non-public route without login");
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};