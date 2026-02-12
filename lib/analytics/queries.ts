import { prisma } from '@/lib/db';

export async function getUnifiedDashboardMetrics(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessionCutoff = new Date(Date.now() - 30 * 60 * 1000);

  // Single aggregated query using Promise.all
  const [
    snapshots,
    todayMetrics,
    topCars,
    topCountries,
    deviceStats,
    recentActivity,
    conversionData,
  ] = await Promise.all([
    // Historical snapshots
    prisma.analyticsDailySnapshot.findMany({
      where: { date: { gte: startDate, lt: today } },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        totalVisitors: true,
        totalSessions: true,
        totalPageViews: true,
        totalProductViews: true,
        totalEnquiries: true,
        viewToEnquiryRate: true,
      },
    }),

    // Today's live metrics (single query with aggregations)
    prisma.$transaction([
      prisma.visitor.count({ where: { firstSeen: { gte: today } } }),
      prisma.session.count({ where: { startedAt: { gte: today } } }),
      prisma.pageView.count({ where: { createdAt: { gte: today } } }),
      prisma.productView.count({ where: { viewedAt: { gte: today } } }),
      prisma.enquiry.count({ where: { createdAt: { gte: today } } }),
      prisma.session.count({ where: { lastActivityAt: { gte: sessionCutoff } } }),
    ]),

    // Top cars with enriched data (optimized)
    prisma.$queryRaw<Array<{
      carId: string;
      views: bigint;
      avgDuration: number;
      avgScroll: number;
      enquiries: bigint;
    }>>`
      SELECT 
        pv."carId",
        COUNT(pv.id)::bigint as views,
        COALESCE(AVG(pv."durationMs"), 0)::int as "avgDuration",
        COALESCE(AVG(pv."scrollDepth"), 0)::int as "avgScroll",
        COUNT(DISTINCT e.id)::bigint as enquiries
      FROM "ProductView" pv
      LEFT JOIN "Enquiry" e ON e."carId" = pv."carId" AND e."createdAt" >= ${startDate}
      WHERE pv."viewedAt" >= ${startDate}
      GROUP BY pv."carId"
      ORDER BY views DESC
      LIMIT 10
    `,

    // Top countries (optimized)
    prisma.visitor.groupBy({
      by: ['country'],
      _count: { country: true },
      where: { firstSeen: { gte: startDate } },
      orderBy: { _count: { country: 'desc' } },
      take: 6,
    }),

    // Device stats
    prisma.pageView.groupBy({
      by: ['device'],
      _count: { device: true },
      where: { createdAt: { gte: startDate } },
      orderBy: { _count: { device: 'desc' } },
    }),

    // Recent activity (limited)
    prisma.pageView.findMany({
      take: 10,
      where: { createdAt: { gte: new Date(Date.now() - 3600000) } }, // Last hour only
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        path: true,
        device: true,
        country: true,
        createdAt: true,
      },
    }),

    // Conversion funnel
    prisma.$transaction([
      prisma.visitor.count({ where: { firstSeen: { gte: startDate } } }),
      prisma.productView.count({ where: { viewedAt: { gte: startDate } } }),
      prisma.enquiry.count({ where: { createdAt: { gte: startDate } } }),
    ]),
  ]);

  // Enrich top cars with car details (batch query)
  const carIds = topCars.map(c => c.carId);
  const cars = await prisma.car.findMany({
    where: { id: { in: carIds } },
    select: {
      id: true,
      make: true,
      model: true,
      year: true,
      price: true,
      images: true,
      status: true,
    },
  });

  const topCarsEnriched = topCars.map(tc => {
    const car = cars.find(c => c.id === tc.carId);
    const views = Number(tc.views);
    const enquiries = Number(tc.enquiries);
    return {
      car,
      views,
      avgDuration: tc.avgDuration,
      avgScroll: tc.avgScroll,
      enquiries,
      conversionRate: views > 0 ? ((enquiries / views) * 100).toFixed(2) : '0',
    };
  });

  // Aggregate totals
  const [todayVisitors, todaySessions, todayPageViews, todayProductViews, todayEnquiries, activeSessions] = todayMetrics;
  
  const totalVisitors = snapshots.reduce((sum, s) => sum + s.totalVisitors, 0) + todayVisitors;
  const totalSessions = snapshots.reduce((sum, s) => sum + s.totalSessions, 0) + todaySessions;
  const totalPageViews = snapshots.reduce((sum, s) => sum + s.totalPageViews, 0) + todayPageViews;
  const totalProductViews = snapshots.reduce((sum, s) => sum + s.totalProductViews, 0) + todayProductViews;
  const totalEnquiries = snapshots.reduce((sum, s) => sum + s.totalEnquiries, 0) + todayEnquiries;

  return {
    overview: {
      totalVisitors,
      totalSessions,
      totalPageViews,
      totalProductViews,
      totalEnquiries,
      activeSessions,
      conversionRate: totalProductViews > 0 ? ((totalEnquiries / totalProductViews) * 100).toFixed(2) : '0',
    },
    topCars: topCarsEnriched,
    topCountries: topCountries.map(c => ({ country: c.country, count: c._count.country })),
    deviceStats: deviceStats.map(d => ({ type: d.device || 'Desktop', count: d._count.device })),
    recentActivity,
    funnel: [
      { stage: 'Visitors', count: conversionData[0], percentage: 100 },
      { stage: 'Product Views', count: conversionData[1], percentage: conversionData[0] > 0 ? ((conversionData[1] / conversionData[0]) * 100).toFixed(1) : '0' },
      { stage: 'Enquiries', count: conversionData[2], percentage: conversionData[0] > 0 ? ((conversionData[2] / conversionData[0]) * 100).toFixed(1) : '0' },
    ],
    snapshots,
  };
}

export async function getRecentCars(limit: number = 5) {
  return prisma.car.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      make: true,
      model: true,
      price: true,
      images: true,
      status: true,
      condition: true,
      createdAt: true,
    },
  });
}

export async function getRecentEnquiries(limit: number = 5) {
  return prisma.enquiry.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userName: true,
      userEmail: true,
      message: true,
      status: true,
      createdAt: true,
      car: {
        select: { make: true, model: true },
      },
    },
  });
}
