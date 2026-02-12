import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalVisitors,
      totalSessions,
      totalPageViews,
      totalProductViews,
      totalEnquiries,
      avgProductDuration,
    ] = await Promise.all([
      prisma.visitor.count({
        where: { firstSeen: { gte: yesterday, lt: today } },
      }),
      prisma.session.count({
        where: { startedAt: { gte: yesterday, lt: today } },
      }),
      prisma.pageView.count({
        where: { createdAt: { gte: yesterday, lt: today } },
      }),
      prisma.productView.count({
        where: { viewedAt: { gte: yesterday, lt: today } },
      }),
      prisma.enquiry.count({
        where: { createdAt: { gte: yesterday, lt: today } },
      }),
      prisma.productView.aggregate({
        where: { viewedAt: { gte: yesterday, lt: today } },
        _avg: {
          durationMs: true,
        },
      }),
    ]);

    const viewToEnquiryRate = totalProductViews > 0 
      ? (totalEnquiries / totalProductViews) * 100 
      : 0;

    await prisma.analyticsDailySnapshot.upsert({
      where: { date: yesterday },
      update: {
        totalVisitors,
        totalSessions,
        totalPageViews,
        totalProductViews,
        totalEnquiries,
        avgSessionDurationMs: null,
        avgProductViewDurationMs: Math.round(avgProductDuration._avg.durationMs || 0),
        viewToEnquiryRate,
        bounceRate: null,
      },
      create: {
        date: yesterday,
        totalVisitors,
        totalSessions,
        totalPageViews,
        totalProductViews,
        totalEnquiries,
        avgSessionDurationMs: null,
        avgProductViewDurationMs: Math.round(avgProductDuration._avg.durationMs || 0),
        viewToEnquiryRate,
        bounceRate: null,
      },
    });

    return NextResponse.json({ success: true, date: yesterday });
  } catch (error) {
    console.error('Snapshot generation error:', error);
    return NextResponse.json({ error: 'Failed to generate snapshot' }, { status: 500 });
  }
}
