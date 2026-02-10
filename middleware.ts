import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // 1. Handle Admin Routes Protection
    if (nextUrl.pathname.startsWith('/admin')) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }
        return NextResponse.next();
    }

    // 2. Skip API/Internal
    if (
        nextUrl.pathname.startsWith('/api') ||
        nextUrl.pathname.startsWith('/_next') ||
        nextUrl.pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // 3. Handle i18n
    return intlMiddleware(req as unknown as NextRequest);
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
