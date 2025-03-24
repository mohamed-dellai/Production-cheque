import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';
import { NextURL } from 'next/dist/server/web/next-url';

export async function middleware(request) {
  const token = request.cookies.get('token');
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

  
  if (request.nextUrl.pathname==="/") {
      if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const decodedToken = await verifyToken(token.value); 

    if (!decodedToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const userId = decodedToken.id;
    const accountId = decodedToken.accountId;
    const response = NextResponse.next();
    response.cookies.set('user-id', userId, { httpOnly: true, secure: true, path: '/' });
    response.cookies.set('account-id', accountId, { httpOnly: true, secure: true, path: '/' });
    return response;
  }
  return NextResponse.next();
}
