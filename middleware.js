import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';
import { NextURL } from 'next/dist/server/web/next-url';

export async function middleware(request) {
  const token = request.cookies.get('token');
  
  // Allow access to login page if not logged in
  if(request.nextUrl.pathname==='/login') {
    if(!token) {
      return NextResponse.next();
    }
    const decodedToken = await verifyToken(token.value); 
    if (decodedToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  
  // Protected routes that require subscription check
  const protectedRoutes = ['/', '/settings', '/print', '/payment'];
  const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);
  
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const decodedToken = await verifyToken(token.value);
    if (!decodedToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const userId = decodedToken.id;
    const accountId = decodedToken.accountId;
    
    // Use metadata header to pass subscription check requirement to the API route
    // We'll check this in a server component or client component instead of middleware
    const response = NextResponse.next();
    response.cookies.set('user-id', userId, { httpOnly: true, secure: true, path: '/' });
    response.cookies.set('account-id', accountId, { httpOnly: true, secure: true, path: '/' });
    response.headers.set('x-middleware-cache', 'no-cache'); // Prevent caching
    return response;
  }
  
  return NextResponse.next();
}
