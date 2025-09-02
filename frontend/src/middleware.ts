import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is /studio
  if (path.startsWith('/studio')) {
    // Check for authentication cookie
    const isAuthenticated = request.cookies.get('isAuthenticated');
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // If authenticated or not accessing /studio, continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/studio/:path*']
};