import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { isBot, isInternalIP } from '@/lib/analytics/botFilter';
import { analyticsService } from '@/lib/analytics/service';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  
  if (limit.count >= 60) return false;
  
  limit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Bot filtering
    if (isBot(userAgent) || isInternalIP(ip)) {
      return NextResponse.json({ success: true, filtered: true });
    }

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const { carId, durationMs, scrollDepth, source, referer } = body;

    if (!carId || !durationMs || durationMs < 3000) {
      return NextResponse.json({ success: true, filtered: true });
    }

    const cookieStore = await cookies();
    let visitorId = cookieStore.get('visitor_id')?.value;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    let visitor = await prisma.visitor.findUnique({ where: { visitorId } });

    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: { visitorId, ipHash, userAgent },
      });
    } else {
      await prisma.visitor.update({
        where: { visitorId },
        data: { lastSeen: new Date() },
      });
    }

    let session = await prisma.session.findFirst({
      where: {
        visitorId,
        lastActivityAt: { gte: new Date(Date.now() - 30 * 60 * 1000) },
      },
      orderBy: { lastActivityAt: 'desc' },
    });

    if (!session) {
      session = await prisma.session.create({
        data: { visitorId },
      });
    } else {
      await prisma.session.update({
        where: { id: session.id },
        data: { lastActivityAt: new Date() },
      });
    }

    const recentView = await prisma.productView.findFirst({
      where: {
        visitorId,
        carId,
        viewedAt: { gte: new Date(Date.now() - 5000) },
      },
    });

    if (recentView) {
      return NextResponse.json({ success: true, deduplicated: true });
    }

    await prisma.productView.create({
      data: {
        visitorId,
        sessionId: session.id,
        carId,
        durationMs,
        scrollDepth,
        source,
        referer,
      },
    });

    // Invalidate cache
    analyticsService.invalidateCache();

    const response = NextResponse.json({ success: true });
    response.cookies.set('visitor_id', visitorId, {
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Track product view error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
