import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/analytics/service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    const data = await analyticsService.getDashboardData(days);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
