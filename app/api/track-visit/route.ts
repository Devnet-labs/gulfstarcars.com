import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers, cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import {
    hashIp,
    parseUserAgent,
    detectCountry,
    SESSION_TIMEOUT_MS,
    DEDUP_WINDOW_MS,
    VISITOR_COOKIE_NAME,
    VISITOR_COOKIE_MAX_AGE,
} from '@/lib/analytics';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path, referer } = body;

        const headersList = await headers();
        const cookieStore = await cookies();

        // ─── 1. Country & Device Detection ──────────────────────────
        const country = detectCountry(headersList);
        const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
        const userAgentString = headersList.get('user-agent') || '';
        const ipHash = hashIp(ip);
        const { browser, os, device } = parseUserAgent(userAgentString);

        // ─── 2. Visitor Identification (Cookie-based) ───────────────
        let visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;
        let isNewVisitor = false;

        if (!visitorId) {
            visitorId = randomUUID();
            isNewVisitor = true;
        }

        // Upsert visitor — create on first visit, update lastSeen on return
        await prisma.visitor.upsert({
            where: { visitorId },
            create: {
                visitorId,
                country,
                ipHash,
                userAgent: userAgentString || null,
            },
            update: {
                lastSeen: new Date(),
                // Update country/ipHash in case they changed (VPN, travel, etc.)
                country,
                ipHash,
            },
        });

        // ─── 3. Session Management (30-min timeout) ─────────────────
        const sessionCutoff = new Date(Date.now() - SESSION_TIMEOUT_MS);

        let session = await prisma.session.findFirst({
            where: {
                visitorId,
                lastActivityAt: { gte: sessionCutoff },
            },
            orderBy: { lastActivityAt: 'desc' },
        });

        if (session) {
            // Extend existing session
            await prisma.session.update({
                where: { id: session.id },
                data: { lastActivityAt: new Date() },
            });
        } else {
            // Create new session
            session = await prisma.session.create({
                data: {
                    visitorId,
                },
            });
        }

        // ─── 4. Deduplication (same visitor + same path within 5s) ──
        const dedupCutoff = new Date(Date.now() - DEDUP_WINDOW_MS);
        const recentDuplicate = await prisma.pageView.findFirst({
            where: {
                visitorId,
                path: path || '/',
                createdAt: { gte: dedupCutoff },
            },
        });

        if (!recentDuplicate) {
            // ─── 5. Create PageView ─────────────────────────────────
            await prisma.pageView.create({
                data: {
                    visitorId,
                    sessionId: session.id,
                    path: path || '/',
                    referer: referer || null,
                    device,
                    browser,
                    os,
                    country,
                },
            });
        }

        // ─── 6. Set persistent cookie ───────────────────────────────
        const response = NextResponse.json({
            success: true,
            visitorId,
            country,
            isNewVisitor,
        });

        if (isNewVisitor) {
            response.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: VISITOR_COOKIE_MAX_AGE,
                path: '/',
            });
        }

        return response;
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json(
            { error: 'Failed to track visit' },
            { status: 500 }
        );
    }
}
