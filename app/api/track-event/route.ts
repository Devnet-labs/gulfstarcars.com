import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashIp, VISITOR_COOKIE_NAME } from '@/lib/analytics';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { eventType, data } = await req.json();

    if (eventType === 'team_social_click') {
      const cookieStore = await cookies();
      const visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value || null;
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
      const ipHash = hashIp(ip);

      await prisma.socialClickEvent.create({
        data: {
          memberName: data.memberName,
          platform: data.platform,
          visitorId,
          ipHash,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
