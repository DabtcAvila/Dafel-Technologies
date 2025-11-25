import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Disable security components temporarily to fix edge runtime issues
// const rateLimiter = new RateLimiter();
// const intrusionDetector = new IntrusionDetector();
// const securityManager = SecurityManager.getInstance();

// Routes that require authentication
const protectedRoutes = ['/studio', '/studio/admin', '/admin', '/client', '/hub'];
// Routes that are public
const publicRoutes = ['/', '/login'];
// API routes that require authentication
const protectedApiRoutes = ['/api/users', '/api/admin', '/api/data-sources'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const _method = request.method;
  const _ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const _userAgent = request.headers.get('user-agent') || '';
  const _startTime = Date.now();

  // Check if this is a logout request (signout redirecting to home)
  const isLogoutRedirect = request.nextUrl.searchParams.get('callbackUrl') === '/';
  
  // Skip security checks for logout redirects and static assets
  if (isLogoutRedirect || pathname.startsWith('/_next/') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // Temporarily disable security checks to fix edge runtime issues
  // try {
    // Security checks disabled
  // } catch (error) {
  //   console.error('Security middleware error:', error);
  // }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
  const _isPublicRoute = publicRoutes.includes(pathname);

  // Get the token from the session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if accessing protected route without authentication
  if ((isProtectedRoute || isProtectedApiRoute) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to login page even when authenticated (to handle redirections properly)
  // This allows our custom login logic to work for specific email redirections

  // Check role-based access for admin routes
  if (pathname.startsWith('/studio/admin') && token) {
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/studio', request.url));
    }
  }

  // CSRF Token validation disabled temporarily
  // if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
  //   // CSRF validation disabled
  // }

  // Return basic response without security features temporarily
  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (NextAuth routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};