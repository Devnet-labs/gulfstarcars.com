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

    // 2. Skip API/Internal but add cache headers for static assets
    if (
        nextUrl.pathname.startsWith('/api') ||
        nextUrl.pathname.startsWith('/_next') ||
        nextUrl.pathname.includes('.')
    ) {
        const response = NextResponse.next();

        // Add cache headers for static assets
        if (nextUrl.pathname.startsWith('/_next/static') ||
            nextUrl.pathname.startsWith('/_next/image') ||
            nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2|ttf|otf|eot)$/)) {
            response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        }

        // Cache fonts
        if (nextUrl.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
            response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        }

        return response;
    }

    // 3. Handle i18n
    const response = intlMiddleware(req as unknown as NextRequest);

    // Add security and cache headers for pages
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
